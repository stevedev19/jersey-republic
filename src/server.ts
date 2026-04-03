import fs from "fs";
fs.mkdirSync("./uploads/products", { recursive: true });
fs.mkdirSync("./uploads/members", { recursive: true });

import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env", 
});
import mongoose from "mongoose";
import server from "./app";

// Fix Mongoose deprecation warning
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = Number(process.env.PORT) || 3000;
    server.listen(PORT, "0.0.0.0", function () {
      console.info(`The server is running succesfully on port: ${PORT}`);
      console.info(`Admin project is on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => console.log("ERROR on connection MongoDB", err));