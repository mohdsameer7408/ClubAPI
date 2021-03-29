import mongoose from "mongoose";
import GridFsStorage from "multer-gridfs-storage";
import multer from "multer";
import path from "path";

let gfs, upload;

const connectDB = async () => {
  const dbURI = `mongodb+srv://admin:${process.env.PASS}@cluster0.lca30.mongodb.net/clubAPI?retryWrites=true&w=majority`;
  const dbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  try {
    //   db connection
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
  } catch (error) {
    console.log(`An error occured while connecting to mongoDB: ${error}`);
  }
};

export { gfs, upload };
export default connectDB;
