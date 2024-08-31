import express, { Router, Request, Response, NextFunction } from "express";
import { statusConstants } from "@constants/status.constants";

import dotenv from "dotenv";
dotenv.config();
const router: Router = express.Router();

router.get("/", function (req, res, next) {
  res
    .status(statusConstants.SUCCESS_CODE)
    .json("Welcome to the Lingotalk Web - API");
});

export default router;
