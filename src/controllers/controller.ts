
import User from '../models/user'; 
import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"; // Assuming you want to use the jsonParser middleware
import logger from "morgan";
import cors from "cors";
import routes from "@routes/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import redisClient from '../redis_connect';
// const { auth } = require('express-oauth2-jwt-bearer');





const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
declare global {
  namespace Express {
    interface Request {
      userData?: JwtPayload | string;
      token?: string;
    }
  }
}
// Register function for creating a new user
async function Register(req: Request, res: Response) {
    
        // Create a new instance of the User model
        const newUser = new User({
            username: req.body.username,
            password: req.body.password 
        });
    try {
        // Save the user to the database
        const saved_user = await newUser.save();

        return res.status(201).json({ message: 'User registered successfully', data: saved_user });
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user', data: error });
    }
}


async function Logout(req: Request, res: Response) {
    try {
      const user_id = req.userData?.sub as string;
      const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
  
      if (!user_id || !token) {
        return res.status(400).json({ status: false, message: "Invalid request, missing user or token." });
      }
  
      // Remove the refresh token from Redis
      await redisClient.del(user_id.toString());
  
      // Blacklist the current access token with an expiration time matching the token's expiry
      const accessTokenExpiry = Math.floor((jwt.decode(token) as JwtPayload).exp! - Date.now() / 1000);
      
      if (accessTokenExpiry > 0) {
        await redisClient.set(`BL_${user_id.toString()}`, token, { EX: accessTokenExpiry });
      }
  
      return res.json({ status: true, message: "Logout successful." });
    } catch (error) {
      return res.status(500).json({ status: false, message: "Logout failed", data: error });
    }
  }

function GetAccessToken(req: Request, res: Response) {
    const user_id = req.userData?.sub;
  
    const access_token = jwt.sign({ sub: user_id }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: process.env.JWT_ACCESS_TIME });
    const refresh_token = GenerateRefreshToken(user_id as string);
  
    return res.json({ status: true, message: "Success", data: { access_token, refresh_token } });
}

async function Login(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
        const user = await User.findOne({username: username, password: password}).exec();
        

        if (!user) {
            return res.status(401).json({ status: false, message: "Username or password is not valid." });
        }        
        console.log('user', user);
        const access_token = jwt.sign({sub: user._id}, process.env.JWT_ACCESS_SECRET as string, { expiresIn: process.env.JWT_ACCESS_TIME});
        console.log('access_token', access_token);
        const refresh_token = await GenerateRefreshToken(user._id as string);
        return res.json({status: true, message: "login success", data: {access_token, refresh_token}});
    } catch (error) {
        return res.status(401).json({status: true, message: "login fail", data: error});
    }

 
    
}

async function GenerateRefreshToken(user_id: string) {
    const refresh_token = jwt.sign({ sub: user_id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: process.env.JWT_REFRESH_TIME });
  
    if (!refresh_token) {
      throw new Error("Failed to generate refresh token");
    }
  
    try {
      // Ensure the refresh token is a valid string before setting it in Redis
      await redisClient.set(user_id.toString(), JSON.stringify({ token: refresh_token }));
  
      return refresh_token;
    } catch (error) {
      console.error('Error storing refresh token in Redis:', error);
      throw error; // Re-throw error to handle it appropriately in the calling function
    }
}

export default { Register, Login, Logout, GetAccessToken }