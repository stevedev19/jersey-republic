
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

// Fix Mongoose deprecation warning
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, function () {
      console.info(`The server is running succesfully on port: ${PORT}`);
      console.info(`Admin project is on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => console.log("ERROR on connection MongoDB", err));