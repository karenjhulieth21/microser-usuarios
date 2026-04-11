import { DomainEvent } from '../base-classes/domain-event';

export class UsuarioCreado extends DomainEvent {
  constructor(
    readonly usuarioId: string,
    readonly email: string,
    readonly nombre: string,
    readonly apellido: string,
  ) {
    super();
  }

  getAggregateId(): string {
    return this.usuarioId;
  }
}

export class UsuarioActualizado extends DomainEvent {
  constructor(
    readonly usuarioId: string,
    readonly email: string,
    readonly nombre: string,
    readonly apellido: string,
  ) {
    super();
  }

  getAggregateId(): string {
    return this.usuarioId;
  }
}

export class UsuarioEliminado extends DomainEvent {
  constructor(readonly usuarioId: string) {
    super();
  }

  getAggregateId(): string {
    return this.usuarioId;
  }
}
