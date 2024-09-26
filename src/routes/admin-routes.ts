import express, { Router } from "express";
import adminCtrl from "../controllers/adminCtrl";
import authMiddleware from "../middleware/middleware";

const adminRouter: Router = express.Router();

adminRouter.post("/register", adminCtrl.register);
adminRouter.post("/login", adminCtrl.login);
adminRouter.post(
  "/token",
  authMiddleware.verifyRefreshToken,
  adminCtrl.getAccessToken
);
adminRouter.post("/logout", authMiddleware.verifyToken, adminCtrl.logout);

// Admin
adminRouter.get("/list-mod", authMiddleware.verifyToken, adminCtrl.modeAdmin);

// Super Admin
adminRouter.get(
  "/super-admin/list",
  authMiddleware.verifyToken,
  adminCtrl.listAllAdmins
);
adminRouter.post(
  "/super-admin/create",
  authMiddleware.verifyToken,
  adminCtrl.createAdmin
);
//

adminRouter.delete(
  "/super-admin/delete/:id",
  authMiddleware.verifyToken,
  adminCtrl.deleteAdmin
);

// Patch - update

export default adminRouter;
