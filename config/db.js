import mongoose from "mongoose";

const connectDB = async () => {
  const dbURI = `mongodb+srv://admin:${process.env.PASS}@cluster0.lca30.mongodb.net/clubAPI?retryWrites=true&w=majority`;
  const dbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  try {
    const conn = await mongoose.connect(dbURI, dbOptions);
    console.log(`MongoDB connected:${conn.connection.host}`);
  } catch (error) {
    console.log(`An error occured while connecting to mongoDB: ${error}`);
  }
};

export default connectDB;
