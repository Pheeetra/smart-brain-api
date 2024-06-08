import bodyParser from "body-parser";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import {handleRegister} from "./controllers/register.js";
import { handleSignIn } from "./controllers/signin.js";
import { handleProfileGet } from "./controllers/profile.js";
import { handleImage } from "./controllers/image.js";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "pheaktratouch",
    password: "Pheaktra1234",
    database: "smartbrain",
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("SmartBrain API is running");
});
app.post("/signin", handleSignIn(db, bcrypt));
app.post("/register",(req, res) => {handleRegister(req, res, db, bcrypt)});
app.get("/profile/:id",(res, req) => {handleProfileGet(res, req, db)});
app.put("/image",(req, res) => {handleImage(req, res, db)});
app.listen(3000, () => {
  console.log("app is running on port 3000");
});
