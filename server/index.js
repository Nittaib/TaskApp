const express = require("express");
const corsMiddleware = require("./middlewares/cors");
const taskRoutes = require("./routes/tasksRouter");
const { connectRedis } = require("./db/redis");
const { connectMongoDB } = require("./db/mongodb");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use("/", taskRoutes);

const startServer = async () => {
  try {
    await Promise.all([connectRedis(), connectMongoDB()]);
    console.log("Connected to Redis and MongoDB");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
