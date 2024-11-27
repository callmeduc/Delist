// app.js 
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { handleDelist } from "./delist.js";
const app = express();

// Create router
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));




// Routes
app.use("/", userRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
