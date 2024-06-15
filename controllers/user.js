const User = require("../models/user");

const handleGetAllUsers = async (_, res) => {
  const allDBUsers = await User.find({});

  return res.json(allDBUsers);
};

const handleCreateUser = async (req, res) => {
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

  return res.status(200).json({ message: "success" });
};

const handleGetUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "record not found!" });
  }

  return res.json({ status: "success", user });
};

const handleUpdateUserById = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);

  return res.json({
    status: "success",
    id: req.params.id,
    message: "successfully updated",
  });
};

const handleDeleteUserById = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res.json({
    status: "success",
    id: req.params.id,
    message: "successfully deleted",
  });
};

module.exports = {
  handleCreateUser,
  handleGetUserById,
  handleGetAllUsers,
  handleUpdateUserById,
  handleDeleteUserById,
};
