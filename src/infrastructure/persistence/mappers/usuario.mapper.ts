import { Mapper } from './base-mapper';
import { UsuarioResponseDTO } from '../../../application/dto/usuario.dto';
import { Usuario } from '../../../domain/aggregates/usuario.aggregate';
import { Email } from '../../../domain/value-objects/email';
import { Name } from '../../../domain/value-objects/name';

export class UsuarioMapper extends Mapper<Usuario, UsuarioResponseDTO> {
  public toPersistence(domain: Usuario): any {
    return {
      id: domain['_id'],
      email: domain.Email.value,
      firstName: domain.Nombre.firstName,
      lastName: domain.Nombre.lastName,
      creadoEn: domain.CreadoEn,
      actualizadoEn: domain.ActualizadoEn,
    };
  }

  public toDomain(raw: any): Usuario {
  return Usuario.reconstruct({
    id: raw.id,
    email: Email.create(raw.email),
    nombre: Name.create(raw.firstName, raw.lastName),
    creadoEn: raw.creadoEn,
    actualizadoEn: raw.actualizadoEn,
  });
}
  public toDTO(domain: Usuario): UsuarioResponseDTO {
    return {
      id: domain['_id'],
      email: domain.Email.value,
      nombre: domain.Nombre.firstName,
      apellido: domain.Nombre.lastName,
      creadoEn: domain.CreadoEn,
      actualizadoEn: domain.ActualizadoEn,
    };
  }
}
