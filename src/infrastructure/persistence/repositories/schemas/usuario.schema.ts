import { Db } from 'mongodb';

export const USUARIO_COLLECTION = 'usuarios';
export const UNIVALLE_EMAIL_PATTERN = '^[A-Za-z0-9._%+-]+@correounivalle\\.edu\\.co$';

export interface UsuarioDocument {
  _id: string;
  id: string;
  email: string;
  password: string;
}

export const usuarioCollectionValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['_id', 'id', 'email', 'password'],
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
        description: 'Correo del usuario',
        pattern: UNIVALLE_EMAIL_PATTERN,
      },
      password: {
        bsonType: 'string',
        description: 'Hash o valor de password persistido',
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

  await db.collection<UsuarioDocument>(USUARIO_COLLECTION).createIndex(
    { email: 1 },
    { unique: true, name: 'uq_usuarios_email' }
  );
}
