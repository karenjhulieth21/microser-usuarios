import { Entity } from '../entities/entity';
import { Email } from '../value-objects/email';
import { Name } from '../value-objects/name';
import { UsuarioCreado, UsuarioActualizado, UsuarioEliminado } from '../events/usuario-events';

export interface UsuarioProps {
  id: string;
  email: Email;
  nombre: Name;
  creadoEn: Date;
  actualizadoEn: Date;
}

export class Usuario extends Entity<{ id: string }> {
  private email: Email;
  private nombre: Name;
  private creadoEn: Date;
  private actualizadoEn: Date;

  private constructor(props: UsuarioProps) {
    super(props.id);
    this.email = props.email;
    this.nombre = props.nombre;
    this.creadoEn = props.creadoEn;
    this.actualizadoEn = props.actualizadoEn;
  }

  public static create(
    id: string,
    email: Email,
    nombre: Name,
  ): Usuario {
    const usuario = new Usuario({
      id,
      email,
      nombre,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    usuario.addDomainEvent(
      new UsuarioCreado(
        usuario.id,
        usuario.email.value,
        usuario.nombre.firstName,
        usuario.nombre.lastName,
      ),
    );

    return usuario;
  }

  public static reconstruct(props: UsuarioProps): Usuario {
    return new Usuario(props);
  }

  public actualizar(email: Email, nombre: Name): void {
    this.email = email;
    this.nombre = nombre;
    this.actualizadoEn = new Date();

    this.addDomainEvent(
      new UsuarioActualizado(
        this.id,
        this.email.value,
        this.nombre.firstName,
        this.nombre.lastName,
      ),
    );
  }

  public eliminar(): void {
    this.addDomainEvent(new UsuarioEliminado(this.id));
  }

  get Email(): Email {
    return this.email;
  }

  get Nombre(): Name {
    return this.nombre;
  }

  get CreadoEn(): Date {
    return this.creadoEn;
  }

  get ActualizadoEn(): Date {
    return this.actualizadoEn;
  }
}
