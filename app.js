// app.js 
import express from "express";
import path from "path";
import { handleDelist } from "./delist.js";
const app = express();

// Create router
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

app.use(express.json());




// Routes
app.use("/", userRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
