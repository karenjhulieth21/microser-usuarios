import { Inject, Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { Usuario } from '../../domain/entities/usuario';
import { CrearUsuarioDTO } from '../dto/usuario.dto';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { UsuarioApplicationService } from '../services/usuario-application.service';
import { Email } from '../../domain/value-objects/email';
import { PasswordService } from '../../infrastructure/security/password.service';

@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly applicationService: UsuarioApplicationService,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: CrearUsuarioDTO): Promise<string> {
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

    const usuarioExistente = await this.usuarioRepository.findByEmail(email);
    if (usuarioExistente) {
      throw UsuarioDomainException.userAlreadyExists(email);
    }

    const temporaryPassword = this.passwordService.generateTemporaryPassword();
    const passwordHash = this.passwordService.hashPassword(temporaryPassword);

    const usuario = Usuario.create(email, passwordHash);
    await this.applicationService.saveAndPublishEvents(usuario);

    return usuario.id;
  }
}
