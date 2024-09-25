import Admin, { IUser } from "../models/admin";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCache, getCache, DEFAULT_CACHE_TIME } from "@utils/cache";
import authCtrl from "./authCtrl"; // Import the auth controller
import TranslationModel, { ITranslation } from "models/translation";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

declare global {
  namespace Express {
    interface Request {
      userData?: JwtPayload | string;
      token?: string;
    }
  }
}

const adminCtrl = {
  register: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      
      const existingUser = await Admin.findOne({ username }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
      }
      const newUser = new Admin({
        username: req.body.username,
        password: req.body.password,
        level: 2,
      });
      // Save the user to the database
      const saved_user = await newUser.save();

      // Cache the registered user data with key based on username and password
    

      return res
        .status(201)
        .json({ message: "User registered successfully", data: saved_user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error registering user", data: error });
    }
  },
  login: async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
  
        const user = await Admin.findOne<IUser>({
          username: username,
          password: password,
        }).exec();

        if (!user) {
          return res.status(401).json({
            status: false,
            message: "Username or password is not valid.",
          });
        }

      const access_token = jwt.sign(
            { sub: user._id }, // Include role for authorization checks if necessary
            process.env.JWT_ACCESS_SECRET as string, 
            { expiresIn: process.env.JWT_ACCESS_TIME }
      );
      

      const refresh_token = await authCtrl.generateRefreshToken(user._id.toString());

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


      const decodedToken = jwt.decode(token) as JwtPayload;
      const accessTokenExpiry = decodedToken.exp
        ? Math.floor(decodedToken.exp - Date.now() / 1000)
        : null;
        
      return res.json({ status: true, message: "Logout successful." });
    } catch (error) {
      console.error("Logout error:", error);
      return res
        .status(500)
        .json({ status: false, message: "Logout failed", data: error });
    }
  },

  getAccessToken: async (req: Request, res: Response) => {
    const user_id = req.userData?.sub;

    
    const access_token = jwt.sign(
        { sub: user_id },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    const refresh_token = await authCtrl.generateRefreshToken(user_id as string);

    return res.json({
      status: true,
      message: "Success",
      data: { access_token, refresh_token },
    });
  },

  listAdmins: async (req: Request, res: Response) => {
    const user = req.userData as IUser;

    try {
      if (Number(user.level) < 1) {
        return res.status(403).json({
          status: false,
          message: "Access denied. Only admins can view this data.",
        });
      }
  
      // Fetch all users with level 1 (admin) or higher
      const admins = await Admin.find({ level: { $gte: 1 } })
        .sort({ original_language: 1, learning_language: 1 })
        .exec();
      
      return res.json({ status: true, data: admins });

     
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error fetching admins",
        data: error,
      });
    }
  },
  modeAdmin: async (req: Request, res: Response) => {

    const user = req.userData as IUser;
    try {
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
        });
      }
      if (Number(user.level) === 0) {
        const modsData = await Admin.find({
          original_language: user.original_language,
          learning_language: user.learning_language,
        }).exec();
        return res.json({ status: true, data: modsData });
      }

      if (Number(user.level) === 1 || Number(user.level) === 2) {
        const allAdmins = await Admin.find({}).exec();
        return res.json({ status: true, data: allAdmins });
      }

      return res.status(403).json({
        status: false,
        message: "Access denied.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error fetching admins",
        data: error,
      });
    }
  },

  createAdmin: async (req: Request, res: Response) => {
    const user = req.userData as IUser;

    if (Number(user.level) !== 2) {
      return res.status(403).json({
        status: false,
        message: "Access denied. Only super admins can create new users.",
      });
    }

    const { username, password, level, original_language, learning_language } =
      req.body;

    try {
      const newUser = new Admin({
        username,
        password,
        level,
        original_language,
        learning_language,
      });

      const savedUser = await newUser.save();

      return res.status(201).json({
        status: true,
        message: "User created successfully.",
        data: savedUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error creating user",
        data: error,
      });
    }
  },

  deleteAdmin: async (req: Request, res: Response) => {
    const user = req.userData as IUser;

    if (Number(user.level) !== 2) {
      return res.status(403).json({
        status: false,
        message: "Access denied. Only super admins can delete users.",
      });
    }
  
    const userIdToDelete = req.params.id;
  
    try {
      const userToDelete = await Admin.findById(userIdToDelete);
  
      if (!userToDelete) {
        return res.status(404).json({
          status: false,
          message: "User not found.",
        });
      }
  
      await Admin.deleteOne({ _id: userIdToDelete });
  
      return res.status(200).json({
        status: true,
        message: "User deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error deleting user",
        data: error,
      });
    }
  },

  listTranslations: async (req: Request, res: Response) => {
    const user = req.userData as IUser; // Assuming `userData` is populated with JWT payload

    try {
      
      let query: any = {};
      if (Number(user.level) === 0) {
        // Mods: Can only view translations matching their languages
        query = {
          original_language: user.original_language,
          target_language: user.learning_language,
        };
      } else if (Number(user.level) >= 1) {
        // Admins and Super Admins: Can view all translations
        query = {}; // No filter applied for languages
      }

      // Fetch translations and sort by original_language and target_language
      const translations = await TranslationModel.find(query)
        .sort({ original_language: 1, target_language: 1 }) // Sort by original and target language
        .exec();

      // Optional: Combine Admin data if needed
      const combinedData = await Promise.all(
        translations.map(async (translation) => {
          const admin = await Admin.findOne({ 
            original_language: translation.original_language,
            learning_language: translation.target_language 
          });
          return {
            ...translation.toObject(),
            admin: admin ? admin.username : null, // Add admin data if available
          };
        })
      );

      return res.status(200).json({
        status: true,
        data: combinedData,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error fetching translations",
        data: error,
      });
    }
  },
};

export default adminCtrl;
