import mongoose from "mongoose";
import GridFsStorage from "multer-gridfs-storage";
import multer from "multer";
import path from "path";
import Pusher from "pusher";

let gfs, upload;

const connectDB = async () => {
  const dbURI = `mongodb+srv://admin:${process.env.PASS}@cluster0.lca30.mongodb.net/clubAPI?retryWrites=true&w=majority`;
  const dbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  // pusher configurations
  const pusher = new Pusher({
    appId: "1209511",
    key: "85e6b2da89ec8c32f889",
    secret: "95f4b738ac442b91f432",
    cluster: "ap2",
    useTLS: true,
  });

  try {
    // db connection
    const conn = await mongoose.connect(dbURI, dbOptions);
    console.log(`MongoDB connected:${conn.connection.host}`);

    // storage connection
    const fileConn = await mongoose.createConnection(dbURI, dbOptions);
    console.log(`MongoDb storage connected:${fileConn.host}`);

    gfs = new mongoose.mongo.GridFSBucket(fileConn.db, {
      bucketName: "images",
    });

    const storage = new GridFsStorage({
      url: dbURI,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: (req, file) =>
        new Promise((resolve, reject) => {
          const fileName = `IMG-${Date.now()}${path.extname(
            file.originalname
          )}`;
          const fileInfo = {
            filename: fileName,
            bucketName: "images",
          };
          resolve(fileInfo);
        }),
    });

    upload = multer({ storage });

    // making mongoDB realtime
    const clubsChangeStream = mongoose.connection.collection("clubs").watch();
    clubsChangeStream.on("change", (change) => {
      console.log("Change stream triggered!");
      console.log(change);

      if (change.operationType === "insert") {
        const data = change.fullDocument;
        console.log("A Club was Created!");
        pusher.trigger("clubs", "inserted", data);
      } else if (
        change.operationType === "update" ||
        change.operationType === "delete"
      ) {
        console.log("A Club was Updated or Deleted!");
        pusher.trigger("clubs", "inserted", {});
      } else {
        console.log("A Strange operation was triggered!");
      }
    });

    const eventsChangeStream = mongoose.connection.collection("events").watch();
    eventsChangeStream.on("change", (change) => {
      console.log("Change stream triggered!");
      console.log(change);

      if (change.operationType === "insert") {
        const data = change.fullDocument;
        console.log("An event was created!");
        pusher.trigger("events", "inserted", data);
      } else if (
        change.operationType === "update" ||
        change.operationType === "delete"
      ) {
        console.log("An event was updated or deleted!");
        pusher.trigger("events", "inserted", {});
      } else {
        console.log("A strange operation was triggered!");
      }
    });

    const feedsChangeStream = mongoose.connection.collection("feeds").watch();
    feedsChangeStream.on("change", (change) => {
      console.log("Change stream triggered!");
      console.log(change);

      if (change.operationType === "insert") {
        const data = change.fullDocument;
        console.log("A Post was Created!");
        pusher.trigger("feeds", "inserted", data);
      } else if (
        change.operationType === "update" ||
        change.operationType === "delete"
      ) {
        console.log("A Post was Updated or Deleted!");
        pusher.trigger("feeds", "inserted", {});
      } else {
        console.log("A Strange operation was triggered!");
      }
    });

    const userChangeStream = mongoose.connection.collection("users").watch();
    userChangeStream.on("change", (change) => {
      console.log("Change stream triggered!");
      console.log(change);

      if (change.operationType === "insert") {
        const data = change.fullDocument;
        console.log("A User was Created!");
        pusher.trigger("user", "inserted", data);
      } else if (
        change.operationType === "update" ||
        change.operationType === "delete"
      ) {
        console.log("A User was Updated or Deleted!");
        pusher.trigger("user", "inserted", change.documentKey);
      } else {
        console.log("A Strange operation was triggered!");
      }
    });
  } catch (error) {
    console.log(`An error occured while connecting to mongoDB: ${error}`);
  }
};

export { gfs, upload };
export default connectDB;
