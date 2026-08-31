import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/db.js';

type DocumentValue = Record<string, any>;

const toObjectId = (value: any): any => {
  if (typeof value === 'string' && ObjectId.isValid(value)) return new ObjectId(value);
  if (Array.isArray(value)) return value.map(toObjectId);
  if (value && typeof value === 'object' && !(value instanceof ObjectId) && !(value instanceof Date)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toObjectId(item)]));
  }
  return value;
};

const attachDocument = (document: DocumentValue, collectionName: string): DocumentValue => {
  document.save = async () => {
    const { _id, save: _save, comparePassword: _comparePassword, __collection: _collection, ...changes } = document;
    await getDatabase().collection(collectionName).updateOne({ _id }, { $set: changes });
    return document;
  };
  return document;
};

class NativeQuery<T = any> implements PromiseLike<T> {
  private populations: Array<{ path: string; fields?: string }> = [];
  public sortSpec: Record<string, 1 | -1> = {};
  public skipCount = 0;
  public limitCount?: number;
  public projection?: Record<string, 0 | 1>;

  constructor(private readonly operation: (query: NativeQuery<T>) => Promise<T>) {}
  populate(path: string, fields?: string): this { this.populations.push({ path, fields }); return this; }
  sort(value: string | Record<string, 1 | -1>): this {
    this.sortSpec = typeof value === 'string'
      ? Object.fromEntries(value.split(' ').filter(Boolean).map((field) => [field.replace('-', ''), field.startsWith('-') ? -1 : 1]))
      : value;
    return this;
  }
  skip(value: number): this { this.skipCount = value; return this; }
  limit(value: number): this { this.limitCount = value; return this; }
  select(value: string): this {
    this.projection = Object.fromEntries(value.split(' ').filter(Boolean).map((field) => [field.replace('+', '').replace('-', ''), field.startsWith('-') ? 0 : 1]));
    return this;
  }
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
  private async execute(): Promise<any> {
    const result: any = await this.operation(this);
    const documents = Array.isArray(result) ? result : result ? [result] : [];
    for (const document of documents) {
      for (const relation of this.populations) await populate(document, relation.path, relation.fields);
    }
    return Array.isArray(result) ? documents : documents[0] || null;
  }
}

const populate = async (document: DocumentValue, path: string, fields?: string): Promise<void> => {
  const [arrayPath, childPath] = path.split('.');
  const collectionName = path === 'category' ? 'categories' : path === 'user' ? 'users' : 'products';
  const values = childPath
    ? (document[arrayPath] || []).map((item: DocumentValue) => item[childPath])
    : [document[path]];
  const ids = values.filter(Boolean).map(toObjectId);
  if (!ids.length) return;
  const projection = fields ? Object.fromEntries(fields.split(' ').map((field) => [field, 1])) : undefined;
  const related = await getDatabase().collection(collectionName).find({ _id: { $in: ids } }, { projection }).toArray();
  const byId = new Map(related.map((item) => [item._id.toString(), item]));
  if (childPath) document[arrayPath].forEach((item: DocumentValue) => { item[childPath] = byId.get(item[childPath]?.toString()) || item[childPath]; });
  else document[path] = byId.get(document[path]?.toString()) || document[path];
};

export const createModel = (collectionName: string): any => {
  const collection = (): Collection => getDatabase().collection(collectionName);
  const wrap = (document: DocumentValue | null): DocumentValue | null => document && attachDocument(document, collectionName);
  const find = (filter: DocumentValue = {}) => {
    let query: NativeQuery;
    query = new NativeQuery(async () => {
      let cursor = collection().find(toObjectId(filter), { projection: query.projection });
      if (query.sortSpec) cursor = cursor.sort(query.sortSpec);
      if (query.skipCount) cursor = cursor.skip(query.skipCount);
      if (query.limitCount !== undefined) cursor = cursor.limit(query.limitCount);
      const items = await cursor.toArray();
      return items.map(wrap);
    });
    return query;
  };
  return {
    find,
    findOne: (filter: DocumentValue) => {
      let query: NativeQuery;
      query = new NativeQuery(async () => wrap(await collection().findOne(toObjectId(filter), { projection: query.projection })));
      return query;
    },
    findById: (id: any) => {
      let query: NativeQuery;
      query = new NativeQuery(async () => wrap(await collection().findOne({ _id: toObjectId(id) }, { projection: query.projection })));
      return query;
    },
    findByIdAndUpdate: (id: any, update: DocumentValue, options: DocumentValue = {}) => new NativeQuery(async () => wrap(await collection().findOneAndUpdate({ _id: toObjectId(id) }, { $set: toObjectId(update) }, { returnDocument: options.new ? 'after' : 'before' }))),
    findByIdAndDelete: (id: any) => new NativeQuery(async () => wrap(await collection().findOneAndDelete({ _id: toObjectId(id) }))),
    create: async (document: DocumentValue) => { const value = { ...toObjectId(document), _id: new ObjectId(), createdAt: new Date(), updatedAt: new Date() }; await collection().insertOne(value); return wrap(value); },
    insertMany: async (documents: DocumentValue[]) => Promise.all(documents.map((document) => (async () => { const value = { ...toObjectId(document), _id: new ObjectId(), createdAt: new Date(), updatedAt: new Date() }; await collection().insertOne(value); return wrap(value); })())),
    deleteMany: (filter: DocumentValue = {}) => collection().deleteMany(toObjectId(filter)),
    countDocuments: (filter: DocumentValue = {}) => collection().countDocuments(toObjectId(filter)),
    aggregate: (pipeline: DocumentValue[]) => collection().aggregate(pipeline.map(toObjectId)).toArray(),
  };
};
