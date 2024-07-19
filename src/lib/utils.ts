import mongoose from "mongoose";

interface ConnectionStatus {
  isConnected: number; // Assuming isConnected will hold the readyState of the connection
}

let connection: ConnectionStatus = {
  isConnected: 0, // Initialize isConnected
};

// export const connectToDB = async () => {
//   if (!process.env.MONGO || "mongodb://localhost:27017/nextjs-admin-dashboard") {
//     throw new Error("MongoDB connection string is not provided in environment variables");
//   }
// console.log(process.env.MONGO, "process.env.MONGO")
//   const { connection } = await mongoose.connect(process.env.MONGO, {
//     dbName: "nextjs-admin-dashboard",
//   });
//   console.log(`Database Connected on ${connection.host}`);
// };

export const connectToDB = async () => {
  try { 
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }

    const db = await mongoose.connect(process.env.MONGO!);
    connection.isConnected = db.connections[0]?.readyState;
    console.log("MongoDB Connected");
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};
