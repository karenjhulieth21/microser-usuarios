Este proyecto implementa una arquitectura profesional combinando cuatro patrones:

```
ARQUITECTURA IMPLEMENTADA
├── DDD (Domain-Driven Design)
├── Hexagonal (Puertos y Adaptadores)
├── Clean Architecture (Capas limpias)
└── Saga Pattern (Orquestación)
```

## Estructura simplificada

```
src/
├── shared/              # Código reutilizable
├── usuarios/            # Módulo usuarios
│   ├── domain/          # Lógica de negocio (pura, sin dependencias)
│   ├── application/     # Casos de uso (orquestan la lógica)
│   └── infrastructure/  # Adaptadores (controllers, repos, etc)
├── main.ts
└── app.module.ts
```

## Quick start

```bash
# 1. Instalar
npm install

# 2. Ejecutar
npm run start:dev

# 3. Probar
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Juan","lastName":"Pérez"}'
```

## Documentación

1. ARCHITECTURE.md ← Leer primero (explicación detallada)
2. QUICKSTART.md ← Endpoints y scripts
3. EXAMPLES.md ← Cómo conectar BD, RabbitMQ, tests, etc
4. IMPLEMENTATION.md ← Lo que se ha construido

## Conceptos clave

### Domain
- Usuario (Agregado) - Raíz que encapsula la lógica
- Email, Name (Value Objects) - Validación integrada
- UsuarioCreado (Domain Events) - Lo que pasó
- IUsuarioRepository (Puertos) - Contrato

### Application
- 5 use cases - Crear, actualizar, eliminar, obtener, listar
- 1 saga - Escucha eventos y orquesta procesos
- DTOs - Entrada/salida de datos

### Infrastructure
- Controller - REST endpoints
- Repository - Persistencia (hoy en mémoire)
- Mappers - Domain ↔ DTO
- Event publisher - Emite eventos

## Flujo de ejemplo: Crear usuario

```
POST /api/usuarios
  └─> UsuarioController.crearUsuario()
       └─> CrearUsuarioUseCase.execute()
            ├─ Valida email único (Repository)
            ├─ Crea value objects
            ├─ Instancia usuario (genera evento)
            ├─ Persiste (Repository.save)
            └─ Emite evento
                 └─> UsuarioSaga.handleUsuarioCreado()
                      ├─ Enviar email
                      ├─ Log en auditoría
                      └─ Notificar otros servicios
```

## Validación

Todos los value objects validan en su constructor:
- Email - Formato válido
- Name - Mínimo 2 caracteres

Las excepciones se lanzan automáticamente y se manejan en el controlador.

## Los 5 endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/usuarios | Crear usuario |
| GET | /api/usuarios | Listar todos |
| GET | /api/usuarios/:id | Obtener por ID |
| PUT | /api/usuarios/:id | Actualizar |
| DELETE | /api/usuarios/:id | Eliminar |

## Próximo paso

Lee ARCHITECTURE.md para entender cada componente en detalle.

---

Esta es una arquitectura profesional lista para:
- Crecer en complejidad
- Agregar nuevos módulos
- Cambiar de tecnología (BD, eventos, etc.)
- Testear fácilmente
- Mantener código limpio
