import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
    process.exit(1);
  }
}

export default dbConnection;
