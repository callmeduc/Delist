import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Application is running on port ${port}!`));
