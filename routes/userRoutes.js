import express from "express";
import { home, test } from "../controllers/userController.js";
const router = express.Router();

router.route("/").get(home);
router.route("/delist").get(test);

export default router;
