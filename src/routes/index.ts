import express, { Router, Request, Response, NextFunction } from "express";
import { statusConstants } from "@constants/status.constants";
// import authCtrl from "../controllers/authCtrl"; // Adjust the path as needed
import dotenv from "dotenv";
dotenv.config();
const router: Router = express.Router();
import adminRouter from "./admin-routes";
import partnerRouter from "./partner-routes"
import teacherRouter from "./teacher-routes";
import tranlationRouter from "./translate-routers";

router.use("/admin", adminRouter);
router.use("/partner", partnerRouter);
router.use("/teacher", teacherRouter);
router.use("/translation", tranlationRouter);

router.get("/", function (req, res, next) {
  res
    .status(statusConstants.SUCCESS_CODE)
    .json("Welcome to the Lingotalk Web - API");
});



export default router;
