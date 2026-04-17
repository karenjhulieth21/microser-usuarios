import { Mapper } from './base-mapper';
import { UsuarioResponseDTO } from '../../../application/dto/usuario.dto';
import { Usuario } from '../../../domain/entities/usuario';

export class UsuarioMapper extends Mapper<Usuario, UsuarioResponseDTO> {

  public toPersistence(domain: Usuario): any {
    return {
      id: domain.id,
      email: domain.email,
      password: domain.password
    };
  }

  public toDomain(raw: any): Usuario {
    return Usuario.reconstruct({
      id: raw.id,
      email: raw.email,
      password: raw.password
    });
  }

  public toDTO(domain: Usuario): UsuarioResponseDTO {
  return {
    id: domain.id,
    email: domain.email,

    // 👇 CAMPOS TEMPORALES PARA QUE NO ROMPA
    nombre: '',
    apellido: '',
    creadoEn: new Date(),
    actualizadoEn: new Date()
  };

  }
}