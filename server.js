import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const port = process.env.PORT || 3030;

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("DB connection error:", err));

app.listen(port, () => console.log(`Application is running on port ${port}!`));
