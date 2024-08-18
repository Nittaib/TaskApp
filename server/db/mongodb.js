const { MongoClient } = require("mongodb");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "taskdb";

let mongoClient;
let mongoDb;

const connectMongoDB = async () => {
  if (!mongoClient) {
    try {
      mongoClient = new MongoClient(mongoUrl);
      await mongoClient.connect();
      console.log("Connected to MongoDB");
      mongoDb = mongoClient.db(dbName);
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }
};

const getMongoClient = () => {
  return { mongoClient, mongoDb };
};

module.exports = { connectMongoDB, getMongoClient };
