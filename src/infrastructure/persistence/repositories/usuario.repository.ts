import { Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { Usuario } from '../../domain/aggregates/usuario.aggregate';
import { UsuarioMapper } from '../mappers/usuario.mapper';

// En-memory store para demo (reemplazar con base de datos real)
@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  private usuarios: Map<string, any> = new Map();
  private mapper = new UsuarioMapper();

  async save(usuario: Usuario): Promise<void> {
    const data = this.mapper.toPersistence(usuario);
    this.usuarios.set(usuario['_id'], data);
  }

  async findById(id: string): Promise<Usuario | null> {
    const data = this.usuarios.get(id);
    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    for (const data of this.usuarios.values()) {
      if (data.email === email) {
        return this.mapper.toDomain(data);
      }
    }
    return null;
  }

  async delete(id: string): Promise<void> {
    this.usuarios.delete(id);
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios: Usuario[] = [];
    for (const data of this.usuarios.values()) {
      usuarios.push(this.mapper.toDomain(data));
    }
    return usuarios;
  }
}
