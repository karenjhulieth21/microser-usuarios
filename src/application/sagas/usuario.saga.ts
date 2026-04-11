import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsuarioCreado, UsuarioActualizado, UsuarioEliminado } from '../../domain/events/usuario-events';

/**
 * SAGA Pattern: Orquesta procesos complejos basados en eventos de dominio
 * 
 * Una saga es un patrón que maneja procesos de larga duración (long-running transactions)
 * coordinando múltiples agregados/servicios a través de eventos.
 * 
 * En este caso, cuando un usuario se crea/actualiza/elimina, la saga puede:
 * - Enviar emails
 * - Crear registros en auditoría
 * - Notificar otros servicios
 * - Realizar compensaciones en caso de error
 */
@Injectable()
export class UsuarioSaga {
  @OnEvent('usuario-creado')
  async handleUsuarioCreado(event: UsuarioCreado) {
    console.log(`
    🎯 [SAGA] Usuario creado
    ├─ ID: ${event.usuarioId}
    ├─ Email: ${event.email}
    ├─ Nombre: ${event.nombre} ${event.apellido}
    └─ Fecha: ${event.dateTimeOccurred.toISOString()}
    `);

    // EJEMPLO DE PROCESOS QUE PODRÍAN EJECUTARSE:
    // 1. Enviar email de bienvenida
    // await this.emailService.sendWelcomeEmail(event.email);

    // 2. Crear entrada en base de datos de auditoría
    // await this.auditService.log('USER_CREATED', event.usuarioId);

    // 3. Notificar a otros servicios (kafka, message broker, etc)
    // await this.messageBroker.publish('users.created', event);

    // 4. Inicializar recursos (storage, quotas, etc)
    // await this.storageService.initialize(event.usuarioId);
  }

  @OnEvent('usuario-actualizado')
  async handleUsuarioActualizado(event: UsuarioActualizado) {
    console.log(`
    🔄 [SAGA] Usuario actualizado
    ├─ ID: ${event.usuarioId}
    ├─ Email: ${event.email}
    ├─ Nombre: ${event.nombre} ${event.apellido}
    └─ Fecha: ${event.dateTimeOccurred.toISOString()}
    `);

    // PROCESOS SECUNDARIOS:
    // 1. Enviar email de confirmación de cambios
    // await this.emailService.sendUpdateConfirmation(event.email);

    // 2. Registrar cambio en auditoría
    // await this.auditService.log('USER_UPDATED', event.usuarioId, event);

    // 3. Sincronizar con otros sistemas
    // await this.externalService.syncUser(event.usuarioId);
  }

  @OnEvent('usuario-eliminado')
  async handleUsuarioEliminado(event: UsuarioEliminado) {
    console.log(`
    ⚠️  [SAGA] Usuario eliminado
    ├─ ID: ${event.usuarioId}
    └─ Fecha: ${event.dateTimeOccurred.toISOString()}
    `);

    // PROCESOS DE LIMPIEZA:
    // 1. Eliminar datos en servicios relacionados (GDPR compliance)
    // await this.analyticsService.delete(event.usuarioId);

    // 2. Cancelar suscripciones
    // await this.subscriptionService.cancel(event.usuarioId);

    // 3. Archivar datos
    // await this.archiveService.archive(event.usuarioId);

    // 4. Notificar
    // await this.messageBroker.publish('users.deleted', event);
  }
}
