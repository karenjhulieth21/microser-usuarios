import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3002/api/usuarios';
const ALLOWED_DOMAIN = '@correounivalle.edu.co';

const initialForm = {
  email: '',
  firstName: '',
  lastName: '',
};

function isValidInstitutionalEmail(email) {
  return /^[A-Za-z0-9._%+-]+@correounivalle\.edu\.co$/i.test(email.trim());
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function cargarUsuarios() {
    setLoadingUsers(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('No fue posible consultar los usuarios.');
      }
      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const normalizedEmail = form.email.trim().toLowerCase();
    if (!isValidInstitutionalEmail(normalizedEmail)) {
      setError(`Solo se permiten correos con dominio ${ALLOWED_DOMAIN}.`);
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Debes completar nombre y apellido para la prueba.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'No fue posible crear el usuario.');
      }

      setSuccess(`Usuario creado con id ${payload.id}.`);
      setForm(initialForm);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Laboratorio de pruebas</p>
          <h1>Usuarios Univalle</h1>
          <p className="hero-text">
            Esta interfaz sirve para probar la API de usuarios y verificar que
            solo entren correos institucionales con el dominio requerido.
          </p>
        </div>
        <div className="hero-badge">
          <span>Dominio obligatorio</span>
          <strong>{ALLOWED_DOMAIN}</strong>
        </div>
      </section>

      <section className="content-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>Crear usuario</h2>
          <label>
            Correo institucional
            <input
              name="email"
              type="email"
              placeholder={`usuario${ALLOWED_DOMAIN}`}
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Nombre
            <input
              name="firstName"
              type="text"
              placeholder="Karen"
              value={form.firstName}
              onChange={handleChange}
            />
          </label>

          <label>
            Apellido
            <input
              name="lastName"
              type="text"
              placeholder="Lucumi"
              value={form.lastName}
              onChange={handleChange}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Probar creacion'}
          </button>

          {error ? <p className="message error">{error}</p> : null}
          {success ? <p className="message success">{success}</p> : null}
        </form>

        <section className="panel list-panel">
          <div className="list-header">
            <h2>Usuarios registrados</h2>
            <button type="button" className="secondary" onClick={cargarUsuarios}>
              Actualizar
            </button>
          </div>

          {loadingUsers ? <p className="empty-state">Cargando usuarios...</p> : null}

          {!loadingUsers && usuarios.length === 0 ? (
            <p className="empty-state">Todavia no hay usuarios creados.</p>
          ) : null}

          <div className="user-list">
            {usuarios.map((usuario) => (
              <article className="user-card" key={usuario.id}>
                <p className="user-email">{usuario.email}</p>
                <p className="user-id">{usuario.id}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
