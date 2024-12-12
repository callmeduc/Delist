import express from "express";
import {
  home,
  test,
  name,
  all,
  handleName,
  analyzeMarkets,
  getProducts,
  getProductByName,
  getProductByWeek,
} from "../controllers/userController.js";
const router = express.Router();

router.route("/").get(home);
router.route("/test").get(test);
router.route("/all").get(all);
router.route("/week").get(getProductByWeek);
router.route("/product").get(getProductByName);
router.route("/products").get(getProducts);
router.route("/market").get(analyzeMarkets);
router.route("/name").get(name).post(handleName);

export default router;
