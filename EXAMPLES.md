# Ejemplos de Implementación

## 1. Conectar Base de Datos (TypeORM + PostgreSQL)

### Instalación
```bash
npm install @nestjs/typeorm typeorm pg
```

### 1.1 Entity TypeORM
```typescript
// usuarios/infrastructure/persistence/entities/usuario.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 100 })
  firstName: string;

  @Column('varchar', { length: 100 })
  lastName: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
```

### 1.2 Repository Implementation
```typescript
// usuarios/infrastructure/persistence/repositories/usuario.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { Usuario } from '../../domain/aggregates/usuario.aggregate';
import { UsuarioEntity } from '../entities/usuario.entity';
import { UsuarioMapper } from '../mappers/usuario.mapper';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  private mapper = new UsuarioMapper();

  constructor(
    @InjectRepository(UsuarioEntity)
    private typeormRepository: Repository<UsuarioEntity>,
  ) {}

  async save(usuario: Usuario): Promise<void> {
    const data = this.mapper.toPersistence(usuario);
    await this.typeormRepository.save(data);
  }

  async findById(id: string): Promise<Usuario | null> {
    const data = await this.typeormRepository.findOne({ where: { id } });
    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const data = await this.typeormRepository.findOne({ where: { email } });
    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepository.delete(id);
  }

  async findAll(): Promise<Usuario[]> {
    const datos = await this.typeormRepository.find();
    return datos.map(data => this.mapper.toDomain(data));
  }
}
```

### 1.3 Actualizar Módulo
```typescript
// usuarios/usuarios.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './infrastructure/persistence/entities/usuario.entity';
import { UsuarioRepository } from './infrastructure/persistence/repositories/usuario.repository';
// ... otros imports

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuarioController],
  providers: [
    // ... otros providers
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioRepository,
    },
  ],
})
export class UsuariosModule {}
```

### 1.4 Configurar TypeORM en app.module.ts
```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterProviderModule } from './shared/infrastructure/providers/event-emitter.provider';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'usuarios_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    EventEmitterProviderModule,
    UsuariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 1.5 Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=usuarios_db
NODE_ENV=development
PORT=3000
```

---

## 2. Integrar Message Broker (RabbitMQ)

### Instalación
```bash
npm install @nestjs/microservices amqp-connection-manager amqplib
```

### 2.1 Actualizar Saga para Publicar a RabbitMQ
```typescript
// usuarios/application/sagas/usuario.saga.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { UsuarioCreado } from '../../domain/events/usuario-events';

@Injectable()
export class UsuarioSaga {
  constructor(
    @Inject('RABBITMQ_CLIENT') private client: ClientProxy,
  ) {}

  @OnEvent('usuario-creado')
  async handleUsuarioCreado(event: UsuarioCreado) {
    console.log(`🎯 [SAGA] Usuario creado: ${event.usuarioId}`);

    // Publicar a RabbitMQ para procesamiento asíncronos
    await this.client.emit('usuarios.creado', {
      usuarioId: event.usuarioId,
      email: event.email,
      nombre: event.nombre,
      apellido: event.apellido,
      timestamp: event.dateTimeOccurred,
    }).toPromise();
  }
}
```

### 2.2 Otros Servicios Escuchan el Evento
```typescript
// En otro microservicio (ej: email-service)
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UsuariosEventsController {
  @MessagePattern('usuarios.creado')
  async handleUsuarioCreado(data: any) {
    console.log(`📧 Enviando email de bienvenida a ${data.email}`);
    // Enviar email
    await this.emailService.sendWelcome(data);
  }
}
```

---

## 3. Agregar Validaciones (class-validator)

### Instalación
```bash
npm install class-validator class-transformer
```

### 3.1 Actualizar DTOs
```typescript
// usuarios/application/dto/usuario.dto.ts
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CrearUsuarioDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  lastName: string;
}
```

### 3.2 Aplicar Validación Global
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Aplicar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
```

---

## 4. Agregar Swagger/OpenAPI

### Instalación
```bash
npm install @nestjs/swagger swagger-ui-express
```

### 4.1 Configurar Swagger
```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Usuarios API')
    .setDescription('API de microservicio de usuarios con DDD')
    .setVersion('1.0.0')
    .addTag('usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
  console.log(`Docs disponibles en http://localhost:3000/docs`);
}

bootstrap();
```

### 4.2 Documentar Endpoints
```typescript
// usuarios/infrastructure/controllers/usuario.controller.ts
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: { example: { id: 'uuid' } },
  })
  async crearUsuario(@Body() dto: CrearUsuarioDTO) {
    // ...
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UsuarioResponseDTO,
  })
  async obtenerUsuario(@Param('id') id: string) {
    // ...
  }
}
```

---

## 5. Unit Tests

### 5.1 Test del Agregado
```typescript
// usuarios/domain/aggregates/usuario.aggregate.spec.ts
import { Usuario } from './usuario.aggregate';
import { Email } from '../value-objects/email';
import { Name } from '../value-objects/name';

describe('Usuario Aggregate', () => {
  describe('create', () => {
    it('debería crear un usuario válido', () => {
      const email = Email.create('test@example.com');
      const nombre = Name.create('Juan', 'Pérez');

      const usuario = Usuario.create('1', email, nombre);

      expect(usuario.id).toBe('1');
      expect(usuario.Email).toBe(email);
      expect(usuario.Nombre).toBe(nombre);
      expect(usuario.events).toHaveLength(1);
    });

    it('debería registrar evento UsuarioCreado', () => {
      const email = Email.create('test@example.com');
      const nombre = Name.create('Juan', 'Pérez');

      const usuario = Usuario.create('1', email, nombre);
      const event = usuario.events[0];

      expect(event.constructor.name).toBe('UsuarioCreado');
      expect(event.usuarioId).toBe('1');
      expect(event.email).toBe('test@example.com');
    });
  });

  describe('actualizar', () => {
    it('debería actualizar usuario correctamente', () => {
      const email = Email.create('test@example.com');
      const nombre = Name.create('Juan', 'Pérez');
      const usuario = Usuario.create('1', email, nombre);

      usuario.clearDomainEvents();

      const newEmail = Email.create('nuevo@example.com');
      const newNombre = Name.create('Carlos', 'García');

      usuario.actualizar(newEmail, newNombre);

      expect(usuario.Email.value).toBe('nuevo@example.com');
      expect(usuario.Nombre.fullName).toBe('Carlos García');
      expect(usuario.events).toHaveLength(1);
    });
  });
});
```

### 5.2 Test del Use Case
```typescript
// usuarios/application/use-cases/crear-usuario.use-case.spec.ts
import { CrearUsuarioUseCase } from './crear-usuario.use-case';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { UsuarioApplicationService } from '../services/usuario-application.service';

describe('CreateUsuarioUseCase', () => {
  let useCase: CrearUsuarioUseCase;
  let mockRepository: IUsuarioRepository;
  let mockApplicationService: UsuarioApplicationService;

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    mockApplicationService = {
      saveAndPublishEvents: jest.fn(),
    } as any;

    useCase = new CrearUsuarioUseCase(mockRepository, mockApplicationService);
  });

  it('debería crear usuario con email válido', async () => {
    (mockRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    const id = await useCase.execute({
      email: 'test@example.com',
      firstName: 'Juan',
      lastName: 'Pérez',
    });

    expect(id).toBeDefined();
    expect(mockApplicationService.saveAndPublishEvents).toHaveBeenCalled();
  });

  it('debería fallar si el email ya existe', async () => {
    const existingUser = { id: '1', email: 'test@example.com' };
    (mockRepository.findByEmail as jest.Mock).mockResolvedValue(existingUser);

    await expect(
      useCase.execute({
        email: 'test@example.com',
        firstName: 'Juan',
        lastName: 'Pérez',
      }),
    ).rejects.toThrow('El usuario con email test@example.com ya existe');
  });
});
```

---

## 6. Docker

### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: usuarios_db
    depends_on:
      - postgres
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: usuarios_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Ejecutar con Docker
```bash
docker-compose up -d
```

---

Estos ejemplos te muestran cómo expandir la arquitectura base para producción. Cada patrón se puede aplicar de forma independiente.
