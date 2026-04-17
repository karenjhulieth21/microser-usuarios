import { Injectable, Inject } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { ActualizarUsuarioDTO } from '../dto/usuario.dto';
import { Usuario } from '../../domain/entities/usuario';
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

    let email = usuario.email;

    if (dto.email) {
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
    }

    const usuarioActualizado = Usuario.reconstruct({
      id: usuario.id,
      email,
      password: usuario.password,
    });

    await this.usuarioRepository.save(usuarioActualizado);
  }
}
