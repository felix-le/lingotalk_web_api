import express, { Router } from "express";
import adminCtrl from "../controllers/adminCtrl";
import authMiddleware from "../middleware/middleware";

const adminRouter: Router = express.Router();

adminRouter.post("/register", adminCtrl.register);
adminRouter.post("/login", adminCtrl.login);
adminRouter.get("/logout", authMiddleware.verifyToken, adminCtrl.logout);
adminRouter.post("/token", authMiddleware.verifyRefreshToken, adminCtrl.getAccessToken);
adminRouter.get("/list", authMiddleware.verifyToken,  adminCtrl.listAdmins);
adminRouter.post("/create",authMiddleware.verifyToken, adminCtrl.createAdmin);
adminRouter.delete("/delete/:id",authMiddleware.verifyToken, adminCtrl.deleteAdmin);


export default adminRouter;
