const express = require("express");
const { connectMongoDB } = require("./connection");
const userRouter = require("./routes/user");
const { logReqRes } = require("./middlewares");

const app = express();
const PORT = 8000;
const MONGODB_URL = "mongodb://127.0.0.1:27017/nodejs-learning-1";

// Connection
connectMongoDB(MONGODB_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch((error) => console.log("MongoDB Error", error));

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

// Routes
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log("Server started!"));
