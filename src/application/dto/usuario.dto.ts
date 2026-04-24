export class CrearUsuarioDTO {
  email: string;
}

export class ActualizarUsuarioDTO {
  email?: string;
}

export class UsuarioResponseDTO {
  id: string;
  email: string;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SolicitarAccesoDTO {
  email: string;
}

export class SolicitarAccesoResponseDTO {
  userId: string;
  email: string;
  mustChangePassword: boolean;
  message: string;
  temporaryPasswordPreview?: string;
}

export class LoginDTO {
  email: string;
  password: string;
}

export class LoginResponseDTO {
  userId: string;
  email: string;
  mustChangePassword: boolean;
  message: string;
}

export class CambiarPasswordDTO {
  email: string;
  currentPassword: string;
  newPassword: string;
}
