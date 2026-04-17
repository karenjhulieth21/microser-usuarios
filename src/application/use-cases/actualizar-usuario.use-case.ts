import { Injectable, Inject } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';
import { ActualizarUsuarioDTO } from '../dto/usuario.dto';

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

    // 👇 actualización simple (sin métodos raros)
    const usuarioActualizado = {
      ...usuario,
      email: dto.email ?? usuario.email
    };

    await this.usuarioRepository.save(usuarioActualizado as any);
  }
}