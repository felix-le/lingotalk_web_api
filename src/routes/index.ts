import express, { Router, Request, Response, NextFunction } from "express";
import { statusConstants } from "@constants/status.constants";
// import authCtrl from "../controllers/authCtrl"; // Adjust the path as needed
// import authMiddleware from "../middleware/middleware";
import dotenv from "dotenv";
dotenv.config();
const router: Router = express.Router();
import adminRouter from "./admin-routes";

router.use("/admin", adminRouter);

router.get("/", function (req, res, next) {
  res
    .status(statusConstants.SUCCESS_CODE)
    .json("Welcome to the Lingotalk Web - API");
});

export default router;
