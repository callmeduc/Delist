import express from "express";
import path from "path";
import bodyParser from "body-parser";
import analyzeAllMarkets from "./market.js";
import { handleDelist } from "./delist.js";
import { activeWeb } from "./active.js";
import "./utils/removeData.js";
const app = express();

// Create router
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use("/", userRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

export default app;
