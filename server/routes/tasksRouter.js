const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { getRedisClient } = require("../db/redis");
const { getMongoClient } = require("../db/mongodb");

const router = express.Router();
const collectionName = "tasks";

router.post("/addTask", async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Task description is required" });
  }

  const task = { id: uuidv4(), description };
  try {
    await saveTask(task);
    return res.status(201).json(task);
  } catch {
    return res.status(400).json({ error: "Failed to save task" });
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const redisClient = await getRedisClient();
    const tasks = await redisClient.hGetAll("tasks");

    return res.json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/removeTask", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const redisClient = await getRedisClient();
    await redisClient.hDel("tasks", id);
    await getMongoClient()
      .mongoDb.collection(collectionName)
      .deleteOne({ _id: id });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const saveTask = async (task) => {
  const redisClient = await getRedisClient();
  const mongoClient = await getMongoClient();

  await redisClient.hSet("tasks", task.id, JSON.stringify(task));
  await mongoClient.mongoDb
    .collection(collectionName)
    .insertOne({ _id: task.id, description: task.description });
};

module.exports = router;
