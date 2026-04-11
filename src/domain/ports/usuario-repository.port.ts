import { Usuario } from '../aggregates/usuario.aggregate';

export interface IUsuarioRepository {
  save(usuario: Usuario): Promise<void>;
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Usuario[]>;
}

export interface IDomainEventPublisher {
  publish(events: any[]): Promise<void>;
}
