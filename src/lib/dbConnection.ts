import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log({ db });
    connection.isConnected = db.connections[0].readyState;
    console.log({ connection });
    console.log("Database connected Successfully");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnection;
