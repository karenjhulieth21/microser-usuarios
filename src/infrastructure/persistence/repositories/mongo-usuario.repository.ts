import { ObjectId } from 'mongodb';
import { IUsuarioRepository } from '../../../domain/ports/usuario-repository.port';
import { Usuario } from '../../../domain/entities/usuario';
import { UsuarioMapper } from '../mappers/usuario.mapper';
import { getMongoDb } from '../mongo.connection';

export class MongoUsuarioRepository implements IUsuarioRepository {
  private collectionName = 'usuarios';
  private mapper = new UsuarioMapper();

  async save(usuario: Usuario): Promise<Usuario> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);

    const data = this.mapper.toPersistence(usuario);

    await collection.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: data },
      { upsert: true }
    );

    return usuario;
  }

  async findById(id: string): Promise<Usuario | null> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);

    try {
      const data = await collection.findOne({ _id: new ObjectId(id) });
      if (!data) return null;

      return this.mapper.toDomain({
        id: data._id.toString(),
        ...data
      });
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);

    const data = await collection.findOne({ email });
    if (!data) return null;

    return this.mapper.toDomain({
      id: data._id.toString(),
      ...data
    });
  }

  async delete(id: string): Promise<void> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);

    await collection.deleteOne({ _id: new ObjectId(id) });
  }

  async findAll(): Promise<Usuario[]> {
    const db = getMongoDb();
    const collection = db.collection(this.collectionName);

    const usuarios = await collection.find().toArray();

    return usuarios.map(u =>
      this.mapper.toDomain({
        id: u._id.toString(),
        ...u
      })
    );
  }
}