const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

const connectToDatabase = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://Laurent:1234@cluster0.nxhpr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );
  database = client.db("online-shop");
};

const getDb = () => {
  if (!database) {
    throw new Error('Unable to connect to database');
  }
  return database
};

module.exports = {
    connectToDatabase,
    getDb
}