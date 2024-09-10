import express, { Router, Request, Response, NextFunction } from "express";
import { statusConstants } from "@constants/status.constants";
import userController from '../controllers/controller'; // Adjust the path as needed
import authMiddleware from '../middleware/middleware'
import dotenv from "dotenv";
dotenv.config();
const router: Router = express.Router();

router.post("/register", userController.Register);
router.post("/login", userController.Login);
router.post('/token', authMiddleware.verifyRefreshToken, userController.GetAccessToken);
router.get('/logout', authMiddleware.verifyToken, userController.Logout);


router.get("/", function (req, res, next) {
  res
    .status(statusConstants.SUCCESS_CODE)
    .json("Welcome to the Lingotalk Web - API");
});

export default router;
