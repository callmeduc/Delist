import express from "express";
import path from "path";
import checkDelist from "./delist.js";
const app = express();

// Create router
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

app.use(express.json());


checkDelist();



// Routes
app.use("/", userRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
