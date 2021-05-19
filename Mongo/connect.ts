import { MongoClient } from 'mongodb';
require("dotenv").config();

export default async function connect() {
  const uri = process.env.CONNECTION
  if (!uri) {
    throw new Error("No Connections string found")
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect()
  return client;
}
