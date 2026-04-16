import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { IUsuarioRepository } from '../../domain/ports/usuario-repository.port';
import { Usuario } from '../../domain/aggregates/usuario.aggregate';
import { UsuarioMapper } from '../mappers/usuario.mapper';
import { connectMongoDB, getMongoDb, disconnectMongoDB } from '../mongo.connection';

@Injectable()
export class MongoUsuarioRepository implements IUsuarioRepository, OnModuleInit, OnModuleDestroy {
  private collectionName = 'usuarios';
  private mapper = new UsuarioMapper();

  async onModuleInit() {
    await connectMongoDB();
  }

  async onModuleDestroy() {
    await disconnectMongoDB();
  }

  async save(usuario: Usuario): Promise<void> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);
    const data = this.mapper.toPersistence(usuario);

    await collection.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: data },
      { upsert: true }
    );
  }

  async findById(id: string): Promise<Usuario | null> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);
    
    try {
      const data = await collection.findOne({ _id: new ObjectId(id) });
      if (!data) return null;
      return this.mapper.toDomain(data);
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);
    const data = await collection.findOne({ email });
    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);
    
    try {
      await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  }

  async findAll(): Promise<Usuario[]> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);
    const usuarios = await collection.find({}).toArray();
    return usuarios.map(u => this.mapper.toDomain(u));
  }
}
