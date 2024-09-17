import express, { Router } from "express";
import adminCtrl from "@controllers/adminCtrl";

const adminRouter: Router = express.Router();

adminRouter.post("/register", adminCtrl.register);
adminRouter.post("/login", adminCtrl.login);

// fix it
// adminRouter.post(
//   "/token",
//   authMiddleware.verifyRefreshToken,
//   adminCtrl.getAccessToken
// );
// adminRouter.get("/logout", authMiddleware.verifyToken, adminCtrl.logout);

export default adminRouter;
