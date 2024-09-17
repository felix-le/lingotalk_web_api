import express, { Router, Request, Response, NextFunction } from "express";
import { statusConstants } from "@constants/status.constants";
import authCtrl from "../controllers/authCtrl"; // Adjust the path as needed
import authMiddleware from "../middleware/middleware";
import dotenv from "dotenv";
dotenv.config();
const router: Router = express.Router();

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.post(
  "/token",
  authMiddleware.verifyRefreshToken,
  authCtrl.getAccessToken
);
router.get("/logout", authMiddleware.verifyToken, authCtrl.logout);

router.get("/", function (req, res, next) {
  res
    .status(statusConstants.SUCCESS_CODE)
    .json("Welcome to the Lingotalk Web - API");
});

export default router;
