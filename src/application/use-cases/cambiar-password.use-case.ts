import { Inject, Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { CambiarPasswordDTO } from '../dto/usuario.dto';
import { Email } from '../../domain/value-objects/email';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { PasswordService } from '../../infrastructure/security/password.service';

@Injectable()
export class CambiarPasswordUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: CambiarPasswordDTO): Promise<void> {
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

    const isCurrentPasswordValid = this.passwordService.verifyPassword(
      dto.currentPassword,
      usuario.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw UsuarioDomainException.invalidCredentials();
    }

    if (!dto.newPassword || dto.newPassword.length < 8) {
      throw UsuarioDomainException.weakPassword();
    }

    usuario.changePassword(
      this.passwordService.hashPassword(dto.newPassword),
    );

    await this.usuarioRepository.save(usuario);
  }
}
