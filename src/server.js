import dotenv from "dotenv";
import { app } from "./app";
import { connectDB } from "./config/db";
dotenv.config();

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on ${process.env.PORT}`);
  });
});
