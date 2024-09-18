import express, { Router } from "express";
import adminCtrl from "@controllers/adminCtrl";
import authMiddleware from "../middleware/middleware";

const adminRouter: Router = express.Router();

adminRouter.post("/register", adminCtrl.register);
adminRouter.post("/login", adminCtrl.login);
adminRouter.post("/logout", authMiddleware.verifyToken, adminCtrl.logout);

// fix it
// adminRouter.post(
//   "/token",
//   authMiddleware.verifyRefreshToken,
//   adminCtrl.getAccessToken
// );

export default adminRouter;
