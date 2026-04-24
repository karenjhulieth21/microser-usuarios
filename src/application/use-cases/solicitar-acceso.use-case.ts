import { Inject, Injectable } from '@nestjs/common';
import {
  SolicitarAccesoDTO,
  SolicitarAccesoResponseDTO,
} from '../dto/usuario.dto';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { UsuarioApplicationService } from '../services/usuario-application.service';
import { Email } from '../../domain/value-objects/email';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { Usuario } from '../../domain/entities/usuario';
import { PasswordService } from '../../infrastructure/security/password.service';
import { EmailService } from '../../infrastructure/notifications/email.service';

@Injectable()
export class SolicitarAccesoUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly applicationService: UsuarioApplicationService,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
  ) {}

  async execute(
    dto: SolicitarAccesoDTO,
  ): Promise<SolicitarAccesoResponseDTO> {
    let email: string;

    try {
      email = Email.create(dto.email).value;
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message === 'Invalid institutional email domain') {
        throw UsuarioDomainException.invalidInstitutionalEmail();
      }
      throw UsuarioDomainException.invalidEmail();
    }

    const temporaryPassword = this.passwordService.generateTemporaryPassword();
    const passwordHash = this.passwordService.hashPassword(temporaryPassword);

    let usuario = await this.usuarioRepository.findByEmail(email);

    if (!usuario) {
      usuario = Usuario.create(email, passwordHash);
      await this.applicationService.saveAndPublishEvents(usuario);
    } else {
      usuario.assignTemporaryPassword(passwordHash);
      await this.usuarioRepository.save(usuario);
    }

    await this.emailService.sendTemporaryPassword({
      to: email,
      temporaryPassword,
    });

    return {
      userId: usuario.id,
      email: usuario.email,
      mustChangePassword: usuario.mustChangePassword,
      message:
        'Se genero una contrasena temporal y fue enviada al correo institucional.',
      temporaryPasswordPreview:
        process.env.NODE_ENV === 'production' ? undefined : temporaryPassword,
    };
  }
}
