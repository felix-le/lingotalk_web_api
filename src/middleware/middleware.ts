import express, { Application, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCache, getCache, DEFAULT_CACHE_TIME } from "@utils/cache";
import Admin, { IUser } from "../models/admin";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

declare global {
  namespace Express {
    interface Request {
      userData?: JwtPayload | string;
      token?: string;
    }
  }
}

let refreshTokens: any[] = [];

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Bearer tokenstring
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ status: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ status: false, message: "Token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as JwtPayload;

    req.userData = decoded;
    req.token = token;

    // Verify blacklisted access token

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Your session is not valid.",
      data: error,
    });
  }
}

async function verifyRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.body.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid request. Token is missing." });
  }

  try {
    // Verify and decode the refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;
    req.userData = decoded;

    // Verify if token is in store or not

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Your session is not valid.",
      data: error,
    });
  }
}
async function checkPermission(role: 0 | 1 | 2) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.userData as IUser; // Assuming JWT contains user role

    if (user.level === 2) {
      return next(); // Super admin has full access
    }

    if (role === 1 && user.level === 1) {
      return next(); // Admin can view all data
    }

    if (role === 0 && user.level === 0) {
      return next(); // Mod can view only their own data
    }

    return res.status(403).json({
      status: false,
      message: "You do not have permission to perform this action",
    });
  };
}
export default {
  verifyToken,
  verifyRefreshToken,
  checkPermission,
};
