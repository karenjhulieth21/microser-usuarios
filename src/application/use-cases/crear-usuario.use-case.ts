import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { Usuario } from '../../domain/aggregates/usuario.aggregate';
import { Email } from '../../domain/value-objects/email';
import { Name } from '../../domain/value-objects/name';
import { CrearUsuarioDTO } from '../dto/usuario.dto';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { UsuarioApplicationService } from '../services/usuario-application.service';

@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    @Inject('IUsuarioRepository') private readonly usuarioRepository: IUsuarioRepository,
    private readonly applicationService: UsuarioApplicationService,
  ) {}

  async execute(dto: CrearUsuarioDTO): Promise<string> {
    // Validar que el usuario no exista
    const usuarioExistente = await this.usuarioRepository.findByEmail(dto.email);
    if (usuarioExistente) {
      throw UsuarioDomainException.userAlreadyExists(dto.email);
    }

    // Crear value objects
    const email = Email.create(dto.email);
    const nombre = Name.create(dto.firstName, dto.lastName);

    // Crear agregado
    const usuarioId = uuid();
    const usuario = Usuario.create(usuarioId, email, nombre);

    // Persistir y publicar eventos
    await this.applicationService.saveAndPublishEvents(usuario);

    return usuarioId;
  }
}
