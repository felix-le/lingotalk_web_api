import User from "../models/admin";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCache, getCache, DEFAULT_CACHE_TIME } from "../utils/cache.js";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5501;

declare global {
  namespace Express {
    interface Request {
      userData?: JwtPayload | string;
      token?: string;
    }
  }
}

const authCtrl = {
  register: async (req: Request, res: Response) => {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });

    try {
      // Save the user to the database
      const saved_user = await newUser.save();

      // Cache the registered user data with key based on username and password
      const cacheKey = `user-${req.body.username}-${req.body.password}`;
      await setCache(cacheKey, saved_user, DEFAULT_CACHE_TIME);

      return res
        .status(201)
        .json({ message: "User registered successfully", data: saved_user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error registering user", data: error });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const user_id = req.userData?.sub as string;
      const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

      if (!user_id || !token) {
        return res.status(400).json({
          status: false,
          message: "Invalid request, missing user or token.",
        });
      }

      // Remove the refresh token from cache
      await setCache(user_id.toString(), null, 0);

      // Blacklist the current access token with an expiration time matching the token's expiry
      const accessTokenExpiry = Math.floor(
        (jwt.decode(token) as JwtPayload).exp! - Date.now() / 1000
      );

      if (accessTokenExpiry > 0) {
        await setCache(
          `BL_${user_id.toString()}`,
          token,
          accessTokenExpiry * 1000
        );
      }

      return res.json({ status: true, message: "Logout successful." });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Logout failed", data: error });
    }
  },

  getAccessToken: async (req: Request, res: Response) => {
    const user_id = req.userData?.sub;

    // Attempt to retrieve cached access token
    let access_token = await getCache(`access_token_${user_id}`);
    let refresh_token = await getCache(`refresh_token_${user_id}`);

    if (!access_token || !refresh_token) {
      access_token = jwt.sign(
        { sub: user_id },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: process.env.JWT_ACCESS_TIME }
      );
      refresh_token = await authCtrl.generateRefreshToken(user_id as string);

      // Set cache for tokens
      await setCache(
        `access_token_${user_id}`,
        access_token,
        DEFAULT_CACHE_TIME
      );
      await setCache(
        `refresh_token_${user_id}`,
        refresh_token,
        DEFAULT_CACHE_TIME
      );
    }

    return res.json({
      status: true,
      message: "Success",
      data: { access_token, refresh_token },
    });
  },

  login: async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
      // Create a cache key for this user based on username and password
      const cacheKey = `user-${username}-${password}`;

      // Check if the user data is already cached
      let user = await getCache(cacheKey);

      if (!user) {
        // If not cached, query the database
        user = await User.findOne({
          username: username,
          password: password,
        }).exec();

        if (!user) {
          return res.status(401).json({
            status: false,
            message: "Username or password is not valid.",
          });
        }

        // Cache the user data
        await setCache(cacheKey, user, DEFAULT_CACHE_TIME);
      }

      console.log("user", user);

      // Attempt to retrieve cached tokens
      let access_token = await getCache(`access_token_${user._id}`);
      let refresh_token = await getCache(`refresh_token_${user._id}`);

      if (!access_token || !refresh_token) {
        access_token = jwt.sign(
          { sub: user._id },
          process.env.JWT_ACCESS_SECRET as string,
          { expiresIn: process.env.JWT_ACCESS_TIME }
        );
        console.log("access_token", access_token);

        refresh_token = await authCtrl.generateRefreshToken(user._id as string);

        // Set cache for tokens
        await setCache(
          `access_token_${user._id}`,
          access_token,
          DEFAULT_CACHE_TIME
        );
        await setCache(
          `refresh_token_${user._id}`,
          refresh_token,
          DEFAULT_CACHE_TIME
        );
      }

      return res.json({
        status: true,
        message: "login success",
        data: { access_token, refresh_token },
      });
    } catch (error) {
      return res
        .status(401)
        .json({ status: true, message: "login fail", data: error });
    }
  },

  generateRefreshToken: async (user_id: string) => {
    const refresh_token = jwt.sign(
      { sub: user_id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_TIME }
    );

    if (!refresh_token) {
      throw new Error("Failed to generate refresh token");
    }

    try {
      // Ensure the refresh token is a valid string before setting it in cache
      await setCache(
        user_id.toString(),
        JSON.stringify({ token: refresh_token }),
        DEFAULT_CACHE_TIME
      );

      return refresh_token;
    } catch (error) {
      console.error("Error storing refresh token in cache:", error);
      throw error; // Re-throw error to handle it appropriately in the calling function
    }
  },
};

export default authCtrl;
