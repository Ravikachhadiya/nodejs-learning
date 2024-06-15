const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

// getting mock data from mock json file
// var users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/nodejs-learning-1")
  .then(() => console.log("MongoDB connected!"))
  .catch((error) => console.log("MongoDB Error", error));

// Schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    job_title: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

const USERS_FILE_PATH = "./MOCK_DATA.json";

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Middleware 2 is called");
  fs.appendFile(
    "./log.txt",
    `\n${Date.now()}:${req.ip} ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

app.use((req, res, next) => {
  console.log("Middleware 3 is called");

  // setting custom header.
  // Always put X- as a prefix to follow best practice.
  res.setHeader("X-My-Name", "ravi kachhadiya");

  next();
});

// Routes
app.get("/users", async (req, res) => {
  const allDBUsers = await User.find({});
  const html = `
    <ul>
    ${allDBUsers
      .map((user) => `<li>${user.first_name} - ${user.email}</li>`)
      .join("")}
    </ul>
    `;

  return res.send(html);
});

app.get("/api/users", async (req, res) => {
  const allDBUsers = await User.find({});

  return res.json(allDBUsers);
});

app.post("/api/users", async (req, res) => {
  const body = req.body;

  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const result = await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    gender: body.gender,
    email: body.email,
    job_title: body.job_title,
  });
  console.log("result", result);

  return res.status(200).json({ message: "success" });
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "record not found!" });
    }

    res.json({ status: "success", user });
  })
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);

    return res.json({
      status: "success",
      id: req.params.id,
      message: "successfully updated",
    });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({
      status: "success",
      id: req.params.id,
      message: "successfully deleted",
    });
  });

app.listen(PORT, () => console.log("Server started!"));
