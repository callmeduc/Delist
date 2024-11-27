import express from "express";
import {
  home,
  name,
  test,
  handleName,
  analyzeMarkets,
} from "../controllers/userController.js";
const router = express.Router();

router.route("/").get(home);
router.route("/delist").get(test);
router.route("/market").get(analyzeMarkets);
router.route("/name").get(name).post(handleName);

export default router;
