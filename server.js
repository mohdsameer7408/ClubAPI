import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

// configurations
dotenv.config({ path: "./config/config.env" });
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());

// db connection
await connectDB();

// endpoints
app.get("/", (req, res) => res.status(200).send("Welcome to Club API"));

// listener
app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));
