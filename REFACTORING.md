# 📊 Estructura Refactorizada - DDD + Hexagonal + Clean + Sagas

## ✅ Refactorización Completada

Tu proyecto **microser-usuarios** ha sido refactorizado para seguir una **estructura profesional y limpia**, exactamente como la imagen que compartiste.

---

## 📁 Estructura Nueva (Limpia y Modular)

```
src/
│
├── 🧠 domain/                      # CAPA DE DOMINIO (Lógica de negocio pura)
│   ├── aggregates/
│   │   └── usuario.aggregate.ts    # Entidad raíz del agregado Usuario
│   ├── value-objects/
│   │   ├── email.ts                # VO: Email con validación
│   │   └── name.ts                 # VO: Nombre completo
│   ├── events/
│   │   └── usuario-events.ts       # Domain Events (Creado, Actualizado, Eliminado)
│   ├── ports/
│   │   └── usuario-repository.port.ts  # Interfaces (Puertos hexagonales)
│   ├── exceptions/
│   │   └── usuario-domain-exception.ts # Excepciones de dominio
│   └── index.ts                    # Barrel exports
│
├── 📋 application/                 # CAPA DE APLICACIÓN (Casos de uso)
│   ├── dto/
│   │   └── usuario.dto.ts          # Data Transfer Objects
│   ├── use-cases/
│   │   ├── crear-usuario.use-case.ts
│   │   ├── actualizar-usuario.use-case.ts
│   │   ├── eliminar-usuario.use-case.ts
│   │   ├── obtener-usuario.use-case.ts
│   │   └── listar-usuarios.use-case.ts
│   ├── sagas/
│   │   └── usuario.saga.ts         # Orquestación con Saga Pattern
│   ├── services/
│   │   └── usuario-application.service.ts  # Servicio: persistencia + eventos
│   └── index.ts                    # Barrel exports
│
├── 🔌 infrastructure/              # CAPA DE INFRAESTRUCTURA (Adaptadores)
│   ├── controllers/
│   │   └── usuario.controller.ts   # REST endpoints (Puerto entrante)
│   ├── persistence/
│   │   ├── repositories/
│   │   │   └── usuario.repository.ts  # Implementación del repositorio
│   │   └── mappers/
│   │       ├── mapper.ts           # Mapper base abstracto
│   │       └── usuario.mapper.ts   # Mapper específico
│   ├── providers/
│   │   ├── event-emitter.provider.ts  # Proveedor de eventos
│   │   └── domain-event.publisher.ts  # Publicador de eventos
│   └── index.ts                    # Barrel exports
│
├── 📦 shared/                      # CÓDIGO COMPARTIDO (Reutilizable)
│   ├── domain/
│   │   ├── entities/
│   │   │   └── entity.ts           # Clase base Entity
│   │   ├── value-objects/
│   │   │   └── value-object.ts     # Clase base ValueObject
│   │   ├── events/
│   │   │   └── domain-event.ts     # Clase base DomainEvent
│   │   └── exceptions/
│   │       └── domain-exception.ts # Clase base DomainException
│   ├── application/
│   │   └── mappers/
│   │       └── mapper.ts           # Mapper base abstracto
│   └── infrastructure/
│       └── providers/
│           └── event-emitter.provider.ts  # Módulo EventEmitter global
│
├── app.module.ts                   ✅ Módulo raíz NestJS (ACTUALIZADO)
├── app.controller.ts               API raíz
├── app.service.ts                  Servicio raíz
├── main.ts                         ✅ Punto de entrada (ACTUALIZADO)
├── index.ts                        ✅ Barrel exports principal
│
└── test/                           Tests unitarios y E2E
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

---

## 🔄 Comparación: Antes vs Después

### ❌ Estructura Anterior (Anidada)
```
src/
  └── usuarios/                    ← Extra nivel de anidamiento
      ├── domain/
      ├── application/
      ├── infrastructure/
      └── usuarios.module.ts       ← Módulo separado
```

### ✅ Estructura Nueva (Limpia)
```
src/
  ├── domain/                       ← Directo en src/
  ├── application/
  ├── infrastructure/
  ├── shared/
  ├── app.module.ts               ← Módulo único + providers
  └── main.ts
```

---

## 🎯 Beneficios de la Refactorización

| Aspecto | Antes | Después |
|--------|-------|---------|
| **Profundidad** | 4 niveles (`src/usuarios/domain/...`) | 3 niveles (`src/domain/...`) |
| **Estructura** | Circular (`usuarios.module.ts`) | Lineal e integrada |
| **Escalabilidad** | Limitada a 1 agregado | Lista para multi-agregados |
| **Claridad** | Confusa (¿dónde va el código nuevo?) | Clara (cada capa es evidente) |
| **Mantenimiento** | Difícil (mucho anidamiento) | Fácil (estructura plana) |

---

## 📡 Flujo de una Solicitud (Refactorizado)

```
POST /api/usuarios
    ↓
┌─────────────────────────────────┐
│ UsuarioController (HTTP)        │
│ infrastructure/controllers/     │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│ CrearUsuarioUseCase             │
│ application/use-cases/          │
└────────────┬────────────────────┘
             ├─ Valida (domain)
             ├─ Crea agregado
             ├─ Persiste (repository)
             ├─ Publica eventos
             └─ UsuarioApplicationService
                     ↓
┌─────────────────────────────────┐
│ UsuarioRepository               │
│ infrastructure/persistence/     │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│ UsuarioSaga (@OnEvent)          │
│ application/sagas/              │
│ - Procesa evento                │
│ - Orquesta operaciones          │
└─────────────────────────────────┘
```

---

## 🚀 Comandos Rápidos

### Instalar e Iniciar
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Tests
npm test
```

### Endpoints
```bash
# Crear usuario
POST /api/usuarios
{
  "email": "juan@example.com",
  "firstName": "Juan",
  "lastName": "Pérez"
}

# Listar
GET /api/usuarios

# Obtener
GET /api/usuarios/:id

# Actualizar
PUT /api/usuarios/:id

# Eliminar
DELETE /api/usuarios/:id
```

---

## ✨ Características Implementadas

✅ **3 Capas Limpias**
- Domain (Reglas de negocio)
- Application (Orquestación)
- Infrastructure (Adaptadores)

✅ **DDD Completo**
- Agregados (Usuario)
- Value Objects (Email, Name)
- Domain Events (3 eventos)
- Domain Exceptions

✅ **Arquitectura Hexagonal**
- Puertos (IUsuarioRepository)
- Adaptadores (UsuarioRepository, UsuarioController)
- Inyección de dependencias

✅ **Saga Pattern**
- Orquestación basada en eventos
- @OnEvent listeners
- Procesamiento asíncronos

✅ **Clean Architecture**
- Separación clara de responsabilidades
- Dependencias hacia adentro
- Fácil testeo

---

## 🔗 Importaciones Simplificadas

Ahora puedes importar directamente desde `src/`:

```typescript
// ❌ Antes (anidado)
import { Usuario } from '../../../usuarios/domain/aggregates/usuario.aggregate';
import { CrearUsuarioUseCase } from '../../usuarios/application/use-cases/crear-usuario.use-case';

// ✅ Después (limpio)
import { Usuario } from '../domain/aggregates/usuario.aggregate';
import { CrearUsuarioUseCase } from '../application/use-cases/crear-usuario.use-case';

// ✅ O con barrel exports
import { Usuario, CrearUsuarioUseCase } from '../index';
```

---

## 🧪 Testing

Cada capa es independiente y testeable:

```typescript
// Test del dominio (sin dependencias)
describe('Usuario', () => {
  it('should create valid user', () => {
    const usuario = Usuario.create('1', 
      Email.create('test@example.com'),
      Name.create('Juan', 'Pérez')
    );
    expect(usuario.id).toBe('1');
  });
});

// Test del use case (con mocks)
describe('CrearUsuarioUseCase', () => {
  it('should create user', async () => {
    const mockRepo = {} as IUsuarioRepository;
    const useCase = new CrearUsuarioUseCase(mockRepo, appService);
    const id = await useCase.execute(dto);
    expect(id).toBeDefined();
  });
});
```

---

## 📈 Próximos Pasos

1. **Conectar BD Real** (TypeORM, Prisma, etc)
2. **Integrar Message Broker** (Kafka, RabbitMQ)
3. **Agregar validaciones** (class-validator)
4. **Documentar API** (Swagger)
5. **Agregar autenticación** (JWT, OAuth)
6. **Implementar logs** (Winston, Pino)
7. **CI/CD** (GitHub Actions, GitLab CI)

---

## 📝 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/app.module.ts` | ✅ Actualizado con nuevos providers |
| `src/main.ts` | ✅ Mejorado con logging |
| `src/domain/*` | ✅ Movido y reorganizado |
| `src/application/*` | ✅ Movido y reorganizado |
| `src/infrastructure/*` | ✅ Movido y reorganizado |

---

**✅ Refactorización Completada**

Tu proyecto ahora sigue la estructura profesional según la imagen que compartiste. Toda la lógica existe, pero **mucho más limpia, mantenible y escalable**. 🚀

Consulta `ARCHITECTURE.md` para más detalles sobre conceptos.
