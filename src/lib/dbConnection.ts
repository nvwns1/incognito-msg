import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database already connected");
    return;
  }
  try {
    const db = await mongoose.connect(
      process.env.NEXT_PUBLIC_MONGO_DB_URI || "",
      {}
    );
    // console.log({ db });
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnection;
