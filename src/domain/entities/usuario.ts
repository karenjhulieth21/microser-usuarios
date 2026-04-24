import { randomUUID } from 'crypto';
import { Entity } from './entity';

interface UsuarioProps {
  id: string;
  email: string;
  passwordHash: string;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Usuario extends Entity<UsuarioProps> {
  private props: UsuarioProps;

  private constructor(props: UsuarioProps) {
    super(props.id);
    this.props = props;
  }

  static create(email: string, passwordHash: string): Usuario {
    const now = new Date();

    return new Usuario({
      id: randomUUID(),
      email,
      passwordHash,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstruct(props: UsuarioProps): Usuario {
    return new Usuario({
      ...props,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  updateEmail(email: string): void {
    this.props.email = email;
    this.touch();
  }

  assignTemporaryPassword(passwordHash: string): void {
    this.props.passwordHash = passwordHash;
    this.props.mustChangePassword = true;
    this.touch();
  }

  changePassword(passwordHash: string): void {
    this.props.passwordHash = passwordHash;
    this.props.mustChangePassword = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get mustChangePassword(): boolean {
    return this.props.mustChangePassword;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
