import { MongoClient, Db } from 'mongodb';

let connection: MongoClient;
let db: Db;

export async function connectMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
  }

  connection = new MongoClient(uri);
  await connection.connect();
  db = connection.db();

  console.log('✅ Conectado a MongoDB Atlas');
  return db;
}

export function getMongoDb(): Db {
  if (!db) {
    throw new Error('MongoDB no está conectado');
  }
  return db;
}

export async function disconnectMongoDB(): Promise<void> {
  if (connection) {
    await connection.close();
    console.log('❌ Desconectado de MongoDB');
  }
}
