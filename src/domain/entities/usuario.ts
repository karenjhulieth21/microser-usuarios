import { Entity } from "./entity";

interface UsuarioProps {
  id: string;
  email: string;
  password: string;
}

export class Usuario extends Entity<UsuarioProps> {
  private props: UsuarioProps;

  private constructor(props: UsuarioProps) {
    super(props.id);
    this.props = props;
  }

  static create(email: string, password: string): Usuario {
    return new Usuario({
      id: crypto.randomUUID(),
      email,
      password
    });
  }

  static reconstruct(props: UsuarioProps): Usuario {
    return new Usuario(props);
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }
}