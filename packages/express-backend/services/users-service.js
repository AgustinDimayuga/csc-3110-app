import mongoose from "mongoose";
import userModel from "../models/user.js";
import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

function getMongoURI(dbname) {
  // Pull the single connection string from the environment
  const connection_string = process.env.MONGO_CONNECTION_STRING;

  if (!connection_string) {
    console.error("Error: MONGO_CONNECTION_STRING is not defined in .env");
    return "";
  }

  // Insert the dbname as the path segment, ahead of any existing query string
  const url = new URL(connection_string);
  url.pathname = `/${dbname}`;
  url.searchParams.set("retryWrites", "true");
  url.searchParams.set("w", "majority");

  console.log("Connecting to MongoDB database:", dbname);
  return url.toString();
}

// Mongoose 6+ does not need useNewUrlParser or useUnifiedTopology
mongoose
  .connect(getMongoURI("users"))
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.log("Connection Error:", error));

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

function getUsers(name, job) {
  if (name === undefined && job === undefined) {
    return userModel.find();
  } else if (name && !job) {
    return findUserByName(name);
  } else if (job && !name) {
    return findUserByJob(job);
  } else {
    return userModel.find({ name: name, job: job });
  }
}

function findUserById(id) {
  return userModel.findById(id);
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function removeUser(id) {
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  removeUser,
};
