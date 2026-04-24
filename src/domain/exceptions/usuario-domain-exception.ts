import { DomainException } from '../base-classes/domain-exception';

export class UsuarioDomainException extends DomainException {
  constructor(message: string, code: string = 'USUARIO_ERROR') {
    super(message, code);
    Object.setPrototypeOf(this, UsuarioDomainException.prototype);
  }

  static userNotFound(id: string): UsuarioDomainException {
    return new UsuarioDomainException(
      `Usuario ${id} no encontrado`,
      'USER_NOT_FOUND',
    );
  }

  static userAlreadyExists(email: string): UsuarioDomainException {
    return new UsuarioDomainException(
      `El usuario con email ${email} ya existe`,
      'USER_ALREADY_EXISTS',
    );
  }

  static invalidEmail(): UsuarioDomainException {
    return new UsuarioDomainException(
      'El email proporcionado no es valido',
      'INVALID_EMAIL',
    );
  }

  static invalidInstitutionalEmail(): UsuarioDomainException {
    return new UsuarioDomainException(
      'El email debe pertenecer al dominio @correounivalle.edu.co',
      'INVALID_INSTITUTIONAL_EMAIL',
    );
  }

  static invalidCredentials(): UsuarioDomainException {
    return new UsuarioDomainException(
      'Las credenciales son incorrectas',
      'INVALID_CREDENTIALS',
    );
  }

  static weakPassword(): UsuarioDomainException {
    return new UsuarioDomainException(
      'La nueva contrasena debe tener al menos 8 caracteres',
      'WEAK_PASSWORD',
    );
  }
}
