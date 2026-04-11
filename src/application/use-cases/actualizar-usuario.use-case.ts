import { Injectable, Inject } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { Email } from '../../domain/value-objects/email';
import { Name } from '../../domain/value-objects/name';
import { ActualizarUsuarioDTO } from '../dto/usuario.dto';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { UsuarioApplicationService } from '../services/usuario-application.service';

@Injectable()
export class ActualizarUsuarioUseCase {
  constructor(
    @Inject('IUsuarioRepository') private readonly usuarioRepository: IUsuarioRepository,
    private readonly applicationService: UsuarioApplicationService,
  ) {}

  async execute(dto: ActualizarUsuarioDTO): Promise<void> {
    // Obtener usuario
    const usuario = await this.usuarioRepository.findById(dto.id);
    if (!usuario) {
      throw UsuarioDomainException.userNotFound(dto.id);
    }

    // Validar que el nuevo email no existe (si cambió)
    if (usuario.Email.value !== dto.email) {
      const usuarioConEmail = await this.usuarioRepository.findByEmail(dto.email);
      if (usuarioConEmail) {
        throw UsuarioDomainException.userAlreadyExists(dto.email);
      }
    }

    // Crear value objects
    const email = Email.create(dto.email);
    const nombre = Name.create(dto.firstName, dto.lastName);

    // Actualizar agregado
    usuario.actualizar(email, nombre);

    // Persistir y publicar eventos
    await this.applicationService.saveAndPublishEvents(usuario);
  }
}
