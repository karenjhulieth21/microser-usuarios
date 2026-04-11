# 🗺️ Guía de Navegación - Estructura Refactorizada

## ¿Dónde buscar cada cosa?

### 🎯 Lógica de Negocio
**"Necesito ver cómo se valida un usuario"**
```
👉 src/domain/aggregates/usuario.aggregate.ts
👉 src/domain/value-objects/email.ts
👉 src/domain/value-objects/name.ts
```

**"¿Qué eventos se lanzan cuando algo pasa?"**
```
👉 src/domain/events/usuario-events.ts
```

**"¿Cuáles son los errores posibles?"**
```
👉 src/domain/exceptions/usuario-domain-exception.ts
```

---

### 📋 Casos de Uso / Funcionalidades
**"¿Cómo se crea un usuario?"**
```
👉 src/application/use-cases/crear-usuario.use-case.ts
```

**"¿Cómo se actualiza?"**
```
👉 src/application/use-cases/actualizar-usuario.use-case.ts
```

**"¿Cómo se transforma el dato para mostrar?"**
```
👉 src/application/dto/usuario.dto.ts
```

**"¿Qué sucede después de crear un usuario?"**
```
👉 src/application/sagas/usuario.saga.ts
```

---

### 🔌 Interfaces / Contratos
**"¿Qué métodos debe tener el repositorio?"**
```
👉 src/domain/ports/usuario-repository.port.ts
```

**"¿Cómo se mapean los datos?"**
```
👉 src/infrastructure/persistence/mappers/usuario.mapper.ts
```

---

### 🌐 REST API
**"¿Cuál es el endpoint para crear usuarios?"**
```
👉 src/infrastructure/controllers/usuario.controller.ts
```

**"¿Cómo se conecta la base de datos?"**
```
👉 src/infrastructure/persistence/repositories/usuario.repository.ts
```

---

### 🧠 Conceptos Base
**"¿Qué es una Entidad?"**
```
👉 src/shared/domain/entities/entity.ts
```

**"¿Qué es un Value Object?"**
```
👉 src/shared/domain/value-objects/value-object.ts
```

**"¿Cómo se publican eventos?"**
```
👉 src/shared/domain/events/domain-event.ts
```

---

## 📁 Tabla de Referencia Rápida

| Necesito... | Voy a... | Archivo |
|-------------|----------|---------|
| Crear un nuevo agregado | `src/domain/aggregates/` | `nuevo.aggregate.ts` |
| Crear un Value Object | `src/domain/value-objects/` | `nuevo.ts` |
| Agregar un Domain Event | `src/domain/events/` | `nuevo-events.ts` |
| Crear un Use Case | `src/application/use-cases/` | `nuevo.use-case.ts` |
| Definir un DTO | `src/application/dto/` | `nuevo.dto.ts` |
| Implementar un puerto | `src/infrastructure/` | archivo correspondiente |
| Crear un controlador | `src/infrastructure/controllers/` | `nuevo.controller.ts` |
| Implementar persistencia | `src/infrastructure/persistence/repositories/` | `nuevo.repository.ts` |
| Mapear datos | `src/infrastructure/persistence/mappers/` | `nuevo.mapper.ts` |
| Orquestar procesos | `src/application/sagas/` | `nuevo.saga.ts` |

---

## 🔍 Buscar Importaciones

### Si necesitas importar...

**Un agregado:**
```typescript
import { Usuario } from '../domain/aggregates/usuario.aggregate';
```

**Un Use Case:**
```typescript
import { CrearUsuarioUseCase } from '../application/use-cases/crear-usuario.use-case';
```

**Un DTO:**
```typescript
import { CrearUsuarioDTO } from '../application/dto/usuario.dto';
```

**Un evento:**
```typescript
import { UsuarioCreado } from '../domain/events/usuario-events';
```

**Un Value Object:**
```typescript
import { Email } from '../domain/value-objects/email';
```

---

## 🎯 Flujo: Agregar una Nueva Funcionalidad

### Ejemplo: "Cambiar teléfono del usuario"

**Paso 1: Domain (Lógica de negocio)**
```typescript
// src/domain/value-objects/phone.ts
export class Phone extends ValueObject { ... }

// src/domain/events/usuario-events.ts
export class TelefonoCambiado extends DomainEvent { ... }

// src/domain/aggregates/usuario.aggregate.ts
public cambiarTelefono(phone: Phone): void { ... }
```

**Paso 2: Application (Caso de uso)**
```typescript
// src/application/use-cases/cambiar-telefono.use-case.ts
export class CambiarTelefonoUseCase { 
  async execute(usuarioId: string, phone: string) { ... }
}

// src/application/dto/usuario.dto.ts
export class CambiarTelefonoDTO { phone: string; }
```

**Paso 3: Infrastructure (Adaptador HTTP)**
```typescript
// src/infrastructure/controllers/usuario.controller.ts
@Put(':id/telefono')
async cambiarTelefono(@Param('id') id: string, @Body() dto: CambiarTelefonoDTO) {
  return this.cambiarTelefonoUseCase.execute(id, dto.phone);
}
```

**Paso 4: Saga (Orquestación)**
```typescript
// src/application/sagas/usuario.saga.ts
@OnEvent('telefono-cambiado')
async handleTelefonoCambiado(event: TelefonoCambiado) {
  // Enviar SMS de confirmación, etc
}
```

---

## 🧪 Testing: Dónde escribir tests

```
test/
├── unit/
│   └── domain/
│       ├── aggregates/
│       │   └── usuario.aggregate.spec.ts
│       ├── value-objects/
│       │   ├── email.spec.ts
│       │   └── name.spec.ts
│       └── events/
│           └── usuario-events.spec.ts
├── integration/
│   └── application/
│       └── use-cases/
│           └── crear-usuario.use-case.spec.ts
└── e2e/
    └── usuarios.e2e-spec.ts
```

---

## 💡 Tips de Navegación

✅ **Siempre empieza por el DOMAIN**
- Define lo que el negocio necesita
- Luego encajará en application e infrastructure

✅ **Usa los índices (index.ts)**
```typescript
// en lugar de
import { Usuario } from '../../domain/aggregates/usuario.aggregate';

// usa
import { Usuario } from '../../domain';
```

✅ **Mantén las carpetas pequeñas**
- Si un archivo crece mucho, probablemente necesita dividirse

✅ **Los puertos definen los contratos**
- Si necesitas cambiar cómo funciona algo, actualiza el puerto (interface)

---

## 🎓 Resumen Visual

```
┌─────────────────────────────────────┐
│        USER REQUEST (REST)          │
└──────────────┬──────────────────────┘
               ↓
    ┌──────────────────────┐
    │  INFRASTRUCTURE      │
    │  controllers/        │ ← Puerto entrante
    └──────────┬───────────┘
               ↓
    ┌──────────────────────┐
    │   APPLICATION        │
    │   use-cases/         │ ← Orquestación
    │   services/          │
    │   sagas/             │
    └──────────┬───────────┘
               ↓
    ┌──────────────────────┐
    │      DOMAIN          │
    │   aggregates/        │ ← Lógica de negocio
    │   value-objects/     │
    │   events/            │
    └──────────┬───────────┘
               ↓
    ┌──────────────────────┐
    │  INFRASTRUCTURE      │
    │  repositories/       │ ← Puerto saliente
    │  mappers/            │
    └──────────┬───────────┘
               ↓
         DATABASE / CACHE
```

---

## 🚀 Checklist: Agregar un Nuevo Agregado

- [ ] Crear carpeta `src/domain/aggregates/nuevo.aggregate.ts`
- [ ] Crear carpeta `src/domain/value-objects/` (si necesario)
- [ ] Crear `src/domain/events/nuevo-events.ts`
- [ ] Crear `src/domain/exceptions/nuevo-exception.ts`
- [ ] Crear `src/domain/ports/nuevo.port.ts`
- [ ] Crear 5 Use Cases en `src/application/use-cases/`
- [ ] Crear DTOs en `src/application/dto/`
- [ ] Crear Controller en `src/infrastructure/controllers/`
- [ ] Crear Repository en `src/infrastructure/persistence/repositories/`
- [ ] Crear Mapper en `src/infrastructure/persistence/mappers/`
- [ ] Crear Saga en `src/application/sagas/`
- [ ] Actualizar `app.module.ts`
- [ ] Actualizar índices (`index.ts`)
- [ ] Escribir tests
- [ ] Documentar

---

**¡Ahora navegar la estructura es muy fácil!** 🎉
