# 🚀 Microservicio de Usuarios - Arquitectura DDD + Hexagonal + Clean + Sagas

Bienvenido al proyecto de microservicio de usuarios con una arquitectura profesional y escalable.

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- TypeScript 5+

## 🔧 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Compilar el proyecto
```bash
npm run build
```

### 3. Ejecutar en desarrollo
```bash
npm run start:dev
```

El servidor escuchará en:
```
http://localhost:3000/api
```

## 📚 API Endpoints

### 1. **Crear Usuario**
```bash
POST /api/usuarios
Content-Type: application/json

{
  "email": "juan@example.com",
  "firstName": "Juan",
  "lastName": "Pérez"
}

Response (201):
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 2. **Obtener Usuario**
```bash
GET /api/usuarios/:id

Response (200):
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "juan@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "creadoEn": "2024-01-15T10:30:00Z",
  "actualizadoEn": "2024-01-15T10:30:00Z"
}
```

### 3. **Listar Todos los Usuarios**
```bash
GET /api/usuarios

Response (200):
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "juan@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "creadoEn": "2024-01-15T10:30:00Z",
    "actualizadoEn": "2024-01-15T10:30:00Z"
  }
]
```

### 4. **Actualizar Usuario**
```bash
PUT /api/usuarios/:id
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "firstName": "Juan Carlos",
  "lastName": "Pérez García"
}

Response (200): OK
```

### 5. **Eliminar Usuario**
```bash
DELETE /api/usuarios/:id

Response (204): No Content
```

## 🏗️ Estructura de Arquitectura

Para obtener una visión completa de la arquitectura, lee [ARCHITECTURE.md](./ARCHITECTURE.md)

### Resumen Visual:

```
REQUEST (REST)
    ↓
CONTROLLER (Puerto Entrante)
    ↓
USE CASE (Lógica de Aplicación)
    ↓
DOMAIN MODEL (Agregado, Value Objects)
    ↓ (Genera Domain Events)
REPOSITORY (Puerto Saliente)
    + EVENT PUBLISHER
    ↓
PERSISTENCE (Base de Datos)
    ↓
SAGA (Orquesta Procesos Complejos)
```

## 🔄 Flujo de Creación de Usuario

```
"Crear Usuario"
    ↓
CrearUsuarioUseCase
├─ Valida email único
├─ Crea Value Objects (Email, Name)
├─ Instancia Agregado Usuario
│   └─ Registra evento: UsuarioCreado
├─ Persiste en Repository
├─ Emite evento a EventEmitter2
└─ Retorna ID
    ↓
UsuarioSaga escucha 'usuario-creado'
├─ Envía email de bienvenida
├─ Registra en auditoría
└─ Notifica otros servicios
```

## 🧪 Testing

```bash
# Unit Tests
npm run test

# Tests en modo watch
npm run test:watch

# Cobertura
npm run test:cov

# E2E Tests
npm run test:e2e
```

## 📝 Logging

El proyecto registra eventos importantes en los sagas:

```
🎯 [SAGA] Usuario creado
├─ ID: 550e8400-e29b-41d4-a716-446655440000
├─ Email: juan@example.com
├─ Nombre: Juan Pérez
└─ Fecha: 2024-01-15T10:30:00.000Z

🔄 [SAGA] Usuario actualizado
⚠️  [SAGA] Usuario eliminado
```

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|------------|
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta en producción |
| `npm run start:dev` | Desarrollo con hot-reload |
| `npm run start:debug` | Desarrollo con debugger |
| `npm run start:prod` | Producción (requiere build previo) |
| `npm run lint` | Linter ESLint |
| `npm run format` | Formatea código con Prettier |
| `npm test` | Ejecuta tests unitarios |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:cov` | Cobertura de tests |
| `npm run test:e2e` | E2E tests |

## 🎯 Próximos Pasos

### 1. Conectar Base de Datos
Reemplaza `UsuarioRepository` (en-memory) con una implementación real:

```typescript
// usuarios/infrastructure/persistence/repositories/usuario.repository.ts
@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(private db: PrismaService) {}
  
  async save(usuario: Usuario): Promise<void> {
    // Implementar con tu ORM (Prisma, TypeORM, etc)
  }
}
```

### 2. Integrar Message Broker
Para eventos asíncronos en tiempo real:

```typescript
// Usar Kafka, RabbitMQ, etc
const broker = new RabbitMQModule();
await broker.publish('usuarios.creado', event);
```

### 3. Agregar Swagger/OpenAPI
```bash
npm install @nestjs/swagger swagger-ui-express
```

### 4. Implementar Validaciones
```bash
npm install class-validator class-transformer
```

### 5. Agregar CI/CD
- GitHub Actions
- GitLab CI
- Jenkins

## 📚 Recursos Educativos

- [Domain-Driven Design - Eric Evans](https://domainlanguage.com/ddd/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture - Alistair Cockburn](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)

## 🐛 Troubleshooting

### Error: "Cannot find module 'uuid'"
```bash
npm install uuid
```

### Error: "@nestjs/event-emitter not found"
```bash
npm install @nestjs/event-emitter
```

### Puerto 3000 en uso
```bash
PORT=3001 npm run start:dev
```

## 🤝 Contribuir

1. Crea una rama feature
2. Haz commits descriptivos
3. Abre un Pull Request

## 📄 Licencia

UNLICENSED

## 👨‍💼 Autor

Equipo de Arquitectura

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
