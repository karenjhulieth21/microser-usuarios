import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { Usuario } from '../../domain/entities/usuario';
import { CrearUsuarioDTO } from '../dto/usuario.dto';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { UsuarioApplicationService } from '../services/usuario-application.service';
import { Email } from '../../domain/value-objects/email';

@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly applicationService: UsuarioApplicationService,
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

    // 1. validar duplicado
    const usuarioExistente = await this.usuarioRepository.findByEmail(email);
    if (usuarioExistente) {
      throw UsuarioDomainException.userAlreadyExists(email);
    }

    // 2. crear usuario SIMPLE
    const usuarioId = uuid();

    const usuario = Usuario.reconstruct({
      id: usuarioId,
      email,
      password: '' 
    });

    // 3. guardar
    await this.applicationService.saveAndPublishEvents(usuario);

    return usuarioId;
  }
}
