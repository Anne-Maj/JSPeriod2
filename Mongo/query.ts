import { MongoClient, Db, Collection } from "mongodb"
import connect from "./connect";
import setupTestData from "./setUpTestData"

(async function Tester() {
  const client = await connect();
  const db = client.db("day1ex1")
  const collection = db.collection("inventory")
  const status = await setupTestData(collection)
  //const result = collection.find({status: "A"})
  //const asArr = await result.toArray();
  //console.log(asArr)

  
  //Add your play-around code here
  
  const cursor = db.collection('inventory').find({ item: 'canvas' });
  
  
  const c = db.collection('inventory').find({});
  
  client.close()


  console.log(cursor);
  


})()
