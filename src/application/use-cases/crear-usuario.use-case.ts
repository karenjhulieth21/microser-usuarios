import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { Usuario } from '../../domain/entities/usuario';
import { CrearUsuarioDTO } from '../dto/usuario.dto';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { UsuarioApplicationService } from '../services/usuario-application.service';

@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly applicationService: UsuarioApplicationService,
  ) {}

  async execute(dto: CrearUsuarioDTO): Promise<string> {

    // 1. validar duplicado
    const usuarioExistente = await this.usuarioRepository.findByEmail(dto.email);
    if (usuarioExistente) {
      throw UsuarioDomainException.userAlreadyExists(dto.email);
    }

    // 2. crear usuario SIMPLE
    const usuarioId = uuid();

    const usuario = Usuario.reconstruct({
      id: usuarioId,
      email: dto.email,
      password: '' 
    });

    // 3. guardar
    await this.applicationService.saveAndPublishEvents(usuario);

    return usuarioId;
  }
}