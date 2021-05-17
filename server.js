import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB, { upload, gfs } from "./config/db.js";
import userRouter from "./routes/user.js";
import clubRouter from "./routes/club.js";

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
app.use("/api", userRouter);
app.use("/api", clubRouter);

app.post("/api/upload/image", upload.single("file"), (req, res) =>
  res.status(201).json(req.file)
);

app.get("/api/image", async (req, res) => {
  gfs.find({ filename: req.query.name }).toArray((error, files) => {
    if (error) {
      res.status(500).json(error);
    } else {
      if (!files[0] || !files.length) {
        res.status(404).json("File not found");
      } else {
        gfs.openDownloadStreamByName(files[0].filename).pipe(res);
      }
    }
  });
});

// listener
app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));
