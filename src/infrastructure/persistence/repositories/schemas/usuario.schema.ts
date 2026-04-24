import { Db } from 'mongodb';

export const USUARIO_COLLECTION = 'usuarios';
export const UNIVALLE_EMAIL_PATTERN =
  '^[A-Za-z0-9._%+-]+@correounivalle\\.edu\\.co$';

export interface UsuarioDocument {
  _id: string;
  id: string;
  email: string;
  passwordHash: string;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const usuarioCollectionValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'id',
      'email',
      'passwordHash',
      'mustChangePassword',
      'createdAt',
      'updatedAt',
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'string',
        description: 'UUID del usuario usado como llave primaria',
      },
      id: {
        bsonType: 'string',
        description: 'UUID del usuario',
      },
      email: {
        bsonType: 'string',
        description: 'Correo institucional del usuario',
        pattern: UNIVALLE_EMAIL_PATTERN,
      },
      passwordHash: {
        bsonType: 'string',
        description: 'Hash de la contrasena del usuario',
      },
      mustChangePassword: {
        bsonType: 'bool',
        description: 'Indica si el usuario debe cambiar la contrasena al ingresar',
      },
      createdAt: {
        bsonType: 'date',
        description: 'Fecha de creacion del usuario',
      },
      updatedAt: {
        bsonType: 'date',
        description: 'Fecha de ultima actualizacion del usuario',
      },
    },
  },
};

export async function ensureUsuarioCollectionSchema(db: Db): Promise<void> {
  const collectionExists = await db
    .listCollections({ name: USUARIO_COLLECTION }, { nameOnly: true })
    .hasNext();

  if (!collectionExists) {
    await db.createCollection(USUARIO_COLLECTION, {
      validator: usuarioCollectionValidator,
    });
  } else {
    await db.command({
      collMod: USUARIO_COLLECTION,
      validator: usuarioCollectionValidator,
    });
  }

  await db
    .collection<UsuarioDocument>(USUARIO_COLLECTION)
    .createIndex({ email: 1 }, { unique: true, name: 'uq_usuarios_email' });
}
