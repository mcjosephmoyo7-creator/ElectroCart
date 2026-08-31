import { Db, MongoClient } from 'mongodb';

let database: Db;

const connectDB = async (): Promise<void> => {
  const uri = process.env.DATABASE_URI;
  if (!uri) throw new Error('DATABASE_URI is not configured');

  const client = new MongoClient(uri);
  await client.connect();
  database = client.db(process.env.MONGODB_DATABASE || 'shopcart');
  console.log(`MongoDB connected: ${database.databaseName}`);
};

export default connectDB;

export const getDatabase = (): Db => {
  if (!database) throw new Error('MongoDB has not been connected');
  return database;
};
