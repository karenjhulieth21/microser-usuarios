import { Inject, Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { ActualizarUsuarioDTO } from '../dto/usuario.dto';
import { Email } from '../../domain/value-objects/email';

@Injectable()
export class ActualizarUsuarioUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async execute(id: string, dto: ActualizarUsuarioDTO): Promise<void> {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw UsuarioDomainException.userNotFound(id);
    }

    if (dto.email) {
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

      const usuarioConEmail = await this.usuarioRepository.findByEmail(email);
      if (usuarioConEmail && usuarioConEmail.id !== usuario.id) {
        throw UsuarioDomainException.userAlreadyExists(email);
      }

      usuario.updateEmail(email);
    }

    await this.usuarioRepository.save(usuario);
  }
}
