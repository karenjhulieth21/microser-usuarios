export class CrearUsuarioDTO {
  email: string;
  firstName: string;
  lastName: string;
}

export class ActualizarUsuarioDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class UsuarioResponseDTO {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  creadoEn: Date;
  actualizadoEn: Date;
}
