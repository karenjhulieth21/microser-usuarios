const state = {
  apiBaseUrl:
    localStorage.getItem('usuariosApiBaseUrl') || 'http://localhost:3002/api',
  currentUser: null,
  temporaryPassword: '',
};

const elements = {
  apiBaseUrl: document.querySelector('#apiBaseUrl'),
  apiStatus: document.querySelector('#apiStatus'),
  configForm: document.querySelector('#configForm'),
  accessForm: document.querySelector('#accessForm'),
  loginForm: document.querySelector('#loginForm'),
  changePasswordForm: document.querySelector('#changePasswordForm'),
  accessCode: document.querySelector('#accessCode'),
  accessYear: document.querySelector('#accessYear'),
  loginCode: document.querySelector('#loginCode'),
  loginYear: document.querySelector('#loginYear'),
  loginPassword: document.querySelector('#loginPassword'),
  currentPassword: document.querySelector('#currentPassword'),
  newPassword: document.querySelector('#newPassword'),
  currentUserId: document.querySelector('#currentUserId'),
  currentCode: document.querySelector('#currentCode'),
  currentYear: document.querySelector('#currentYear'),
  currentRole: document.querySelector('#currentRole'),
  currentMustChange: document.querySelector('#currentMustChange'),
  resultOutput: document.querySelector('#resultOutput'),
  copyTempPassword: document.querySelector('#copyTempPassword'),
  roleCards: document.querySelectorAll('.role-card'),
};

function setResult(payload, isError = false) {
  elements.resultOutput.textContent =
    typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  elements.apiStatus.textContent = isError ? 'Error API' : 'API local';
  elements.apiStatus.classList.toggle('error', isError);
}

function setLoading(form, isLoading) {
  const button = form.querySelector('button[type="submit"]');
  if (button) button.disabled = isLoading;
}

function getCredentials(prefix) {
  const now = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);

  return {
    codigo: `${prefix}${suffix}`,
    anioRegistro: now,
  };
}

function setCurrentUser(user) {
  state.currentUser = user;

  elements.currentUserId.textContent = user?.userId || 'Sin sesión';
  elements.currentCode.textContent = user?.codigo || '-';
  elements.currentYear.textContent = user?.anioRegistro || '-';
  elements.currentRole.textContent = user?.rol || '-';
  elements.currentMustChange.textContent =
    typeof user?.mustChangePassword === 'boolean'
      ? user.mustChangePassword
        ? 'Si'
        : 'No'
      : '-';
}

function syncLoginFields({ codigo, anioRegistro }) {
  elements.accessCode.value = codigo;
  elements.loginCode.value = codigo;
  elements.accessYear.value = anioRegistro;
  elements.loginYear.value = anioRegistro;
}

async function apiRequest(path, body) {
  const response = await fetch(`${state.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'string' ? payload : payload.message || payload.error;
    throw new Error(message || `Error HTTP ${response.status}`);
  }

  return payload;
}

function readAccessPayload(form) {
  const data = new FormData(form);

  return {
    codigo: String(data.get('codigo') || '').trim(),
    anioRegistro: Number(data.get('anioRegistro')),
  };
}

elements.apiBaseUrl.value = state.apiBaseUrl;
elements.copyTempPassword.disabled = true;

elements.configForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.apiBaseUrl = elements.apiBaseUrl.value.trim().replace(/\/$/, '');
  localStorage.setItem('usuariosApiBaseUrl', state.apiBaseUrl);
  setResult(`URL API guardada: ${state.apiBaseUrl}`);
});

elements.roleCards.forEach((card) => {
  card.addEventListener('click', () => {
    elements.roleCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');

    const credentials = getCredentials(card.dataset.codePrefix);
    syncLoginFields(credentials);
    setResult({
      message: 'Datos de prueba preparados.',
      ...credentials,
      rolEsperado: card.textContent.trim().replace(/\s+/g, ' '),
    });
  });
});

elements.accessForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoading(elements.accessForm, true);

  try {
    const payload = readAccessPayload(elements.accessForm);
    const result = await apiRequest('/auth/solicitar-acceso', payload);

    state.temporaryPassword = result.temporaryPassword || '';
    elements.copyTempPassword.disabled = !state.temporaryPassword;
    elements.loginPassword.value = state.temporaryPassword;
    elements.currentPassword.value = state.temporaryPassword;
    syncLoginFields(payload);
    setCurrentUser(result);
    setResult(result);
  } catch (error) {
    setResult(error.message, true);
  } finally {
    setLoading(elements.accessForm, false);
  }
});

elements.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoading(elements.loginForm, true);

  try {
    const accessPayload = readAccessPayload(elements.loginForm);
    const result = await apiRequest('/auth/login', {
      ...accessPayload,
      password: elements.loginPassword.value,
    });

    setCurrentUser(result);
    elements.currentPassword.value = elements.loginPassword.value;
    setResult(result);
  } catch (error) {
    setResult(error.message, true);
  } finally {
    setLoading(elements.loginForm, false);
  }
});

elements.changePasswordForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!state.currentUser) {
    setResult('Primero debes iniciar sesión con un usuario.', true);
    return;
  }

  setLoading(elements.changePasswordForm, true);

  try {
    await apiRequest('/auth/cambiar-password', {
      codigo: state.currentUser.codigo,
      anioRegistro: state.currentUser.anioRegistro,
      currentPassword: elements.currentPassword.value,
      newPassword: elements.newPassword.value,
    });

    elements.loginPassword.value = elements.newPassword.value;
    elements.currentPassword.value = elements.newPassword.value;

    const refreshedSession = await apiRequest('/auth/login', {
      codigo: state.currentUser.codigo,
      anioRegistro: state.currentUser.anioRegistro,
      password: elements.newPassword.value,
    });

    state.temporaryPassword = '';
    elements.copyTempPassword.disabled = true;
    setCurrentUser(refreshedSession);
    setResult({
      message: 'Contrasena actualizada correctamente.',
      login: refreshedSession,
    });
  } catch (error) {
    setResult(error.message, true);
  } finally {
    setLoading(elements.changePasswordForm, false);
  }
});

elements.copyTempPassword.addEventListener('click', () => {
  if (!state.temporaryPassword) return;

  elements.loginPassword.value = state.temporaryPassword;
  elements.currentPassword.value = state.temporaryPassword;
  setResult('La contrasena temporal se copio en los formularios de login y cambio.');
});

setResult({
  apiBaseUrl: state.apiBaseUrl,
  flujo: [
    'Elige un rol para preparar un codigo.',
    'Solicita acceso para generar contrasena temporal.',
    'Ingresa con esa contrasena.',
    'Cambia la contrasena y vuelve a validar el login.',
  ],
});
