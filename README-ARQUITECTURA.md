Este proyecto implementa una arquitectura profesional combinando cuatro patrones:

```
ARQUITECTURA IMPLEMENTADA
├── 🎯 DDD (Domain-Driven Design)
├── 🏗️  Hexagonal (Puertos y Adaptadores)
├── 🧹 Clean Architecture (Capas limpias)
└── 🔄 Saga Pattern (Orquestación)
```

## 📂 Estructura Simplificada

```
src/
├── shared/              # Código reutilizable
├── usuarios/            # MÓDULO USUARIOS
│   ├── domain/          # 🧠 LÓGICA DE NEGOCIO (pura, sin dependencias)
│   ├── application/     # 📋 CASOS DE USO (orquestan la lógica)
│   └── infrastructure/  # 🔌 ADAPTADORES (controllers, repos, etc)
├── main.ts
└── app.module.ts
```

## 🚀 Quick Start

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

## 📚 Documentación

1. **ARCHITECTURE.md** ← LEER PRIMERO (explicación detallada)
2. **QUICKSTART.md** ← Endpoints y scripts
3. **EXAMPLES.md** ← Cómo conectar BD, RabbitMQ, tests, etc
4. **IMPLEMENTATION.md** ← Lo que se ha construido

## 🎯 Conceptos Clave

### Domain (Lo que el negocio sabe)
- **Usuario** (Agregado) - Raíz que encapsula la lógica
- **Email, Name** (Value Objects) - Validación embedded
- **UsuarioCreado** (Domain Events) - Lo que pasó
- **IUsuarioRepository** (Puertos) - Contrato

### Application (Lo que la app hace)
- **5 Use Cases** - Crear, Actualizar, Eliminar, Obtener, Listar
- **1 Saga** - Escucha eventos y orquesta procesos
- **DTOs** - Entrada/salida de datos

### Infrastructure (Cómo lo hace)
- **Controller** - REST endpoints
- **Repository** - Persistencia (hoy en-memory)
- **Mappers** - Domain ↔ DTO
- **Event Publisher** - Emite eventos

## 🔄 Flujo de Ejemplo: Crear Usuario

```
POST /api/usuarios
  └─> UsuarioController.crearUsuario()
       └─> CrearUsuarioUseCase.execute()
            ├─ Valida email único (Repository)
            ├─ Crea Value Objects
            ├─ Instancia Usuario (genera evento)
            ├─ Persiste (Repository.save)
            └─ Emite evento
                 └─> UsuarioSaga.handleUsuarioCreado()
                      ├─ Enviar email
                      ├─ Log en auditoría
                      └─ Notificar otros servicios
```

## ✅ Validación

Todos los Value Objects validan en su constructor:
- **Email** - Formato válido
- **Name** - Mínimo 2 caracteres

Las excepciones se lanzan automáticamente y se manejan en el controlador.

## 🔌 Los 5 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/usuarios | Crear usuario |
| GET | /api/usuarios | Listar todos |
| GET | /api/usuarios/:id | Obtener por ID |
| PUT | /api/usuarios/:id | Actualizar |
| DELETE | /api/usuarios/:id | Eliminar |

## 🎯 Próximo Paso

**Lee ARCHITECTURE.md para entender cada componente en detalle.**

---

Esta es una arquitectura profesional lista para:
- ✅ Crecer en complejidad
- ✅ Agregar nuevos módulos
- ✅ Cambiar de tecnología (BD, eventos, etc)
- ✅ Testear fácilmente
- ✅ Mantener código limpio
