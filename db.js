import mongoose from "mongoose";

const DB_NAME = "gatherdev";
const CONNECTION_STRING = `mongodb+srv://gatherdev:${process.env.DB_PASSWORD}@cluster0.awk22e8.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const connectToDatabase = async () => {
  try {
    const db = await mongoose.connect(CONNECTION_STRING);
    if (db) {
      console.log("Connected to database ✅✅✅✅✅✅");
    }
  } catch (e) {
    console.error("Error connecting to database ❌❌❌❌❌❌");
  }
};

export default connectToDatabase;
