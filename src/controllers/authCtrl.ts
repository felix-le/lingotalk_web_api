import jwt from "jsonwebtoken";
import { setCache, DEFAULT_CACHE_TIME } from "@utils/cache";

const authCtrl = {
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
