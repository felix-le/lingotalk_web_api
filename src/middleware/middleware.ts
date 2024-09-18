import express, { Application, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCache, getCache, DEFAULT_CACHE_TIME } from "@utils/cache";

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
    const blacklistedToken = await getCache(
      "BL_" + decoded.sub?.toString() || ""
    );

    if (blacklistedToken === token) {
      return res
        .status(401)
        .json({ status: false, message: "Blacklisted token." });
    }

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
    const data = await getCache(decoded.sub?.toString() || "");

    if (data === null) {
      return res.status(401).json({
        status: false,
        message: "Invalid request. Token is not in store.",
      });
    }

    if (JSON.parse(data).token !== token) {
      return res.status(401).json({
        status: false,
        message: "Invalid request. Token does not match store.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Your session is not valid.",
      data: error,
    });
  }
}

export default {
  verifyToken,
  verifyRefreshToken,
};
