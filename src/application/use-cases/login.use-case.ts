import { Inject, Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { LoginDTO, LoginResponseDTO } from '../dto/usuario.dto';
import { Email } from '../../domain/value-objects/email';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { PasswordService } from '../../infrastructure/security/password.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResponseDTO> {
    let email: string;

    try {
      email = Email.create(dto.email).value;
    } catch {
      throw UsuarioDomainException.invalidCredentials();
    }

    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw UsuarioDomainException.invalidCredentials();
    }

    const isValidPassword = this.passwordService.verifyPassword(
      dto.password,
      usuario.passwordHash,
    );

    if (!isValidPassword) {
      throw UsuarioDomainException.invalidCredentials();
    }

    return {
      userId: usuario.id,
      email: usuario.email,
      mustChangePassword: usuario.mustChangePassword,
      message: usuario.mustChangePassword
        ? 'Ingreso exitoso. Debes cambiar tu contrasena temporal.'
        : 'Ingreso exitoso.',
    };
  }
}
