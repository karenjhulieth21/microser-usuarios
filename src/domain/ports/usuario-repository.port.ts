import { Usuario } from '../entities/usuario';

export interface IUsuarioRepository {
  save(usuario: Usuario): Promise<Usuario>; // ✅ ARREGLADO
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Usuario[]>;
}

export interface IDomainEventPublisher {
  publish(events: any[]): Promise<void>;
}
