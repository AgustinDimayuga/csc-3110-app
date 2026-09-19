// backend.js
import express from "express";
import cors from "cors";
import usersService from "./services/users-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// backend.js

app.get("/users", async (req, res) => {
  console.log("test");
  const name = req.query.name;
  const job = req.query.job;
  try {
    const result = await usersService.getUsers(name, job);
    console.log("result :", result);
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await usersService.findUserById(id);
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const addedUser = await usersService.addUser(req.body);
    res.status(201).send(addedUser);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user_deleted = await usersService.removeUser(req.params.id);
    res.status(204).send(user_deleted);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
