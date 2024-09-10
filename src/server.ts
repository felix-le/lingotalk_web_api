import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"; // Assuming you want to use the jsonParser middleware
import logger from "morgan";
import cors from "cors";
import routes from "@routes/index";
import jwt, { JwtPayload } from "jsonwebtoken";
// const { auth } = require('express-oauth2-jwt-bearer');

import cache from "./routeCache";
import auth_routes from './routes/index';

const app: Application = express();

dotenv.config();
app.use(cors());
app.use(logger("dev"));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("json spaces", 4);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
declare global {
  namespace Express {
    interface Request {
      userData?: JwtPayload | string;
    }
  }
}

app.use('/auth', auth_routes)

let refreshTokens: any[] = [];
// app.use('/api/chinese-speaking', checkJwt, cache(300),  routes); // use routes
app.use("/web/api", cache(300), routes); // use routes




app.post('/token', verifyRefreshToken, (req, res) => {
  const username = typeof req.userData?.sub === 'function' ? req.userData.sub() : req.userData?.sub;

   if (!username) {
    return res.status(400).json({ status: false, message: 'Invalid token payload' });
  }
  const access_token = jwt.sign({sub: username}, process.env.JWT_ACCESS_SECRET as string, {expiresIn: process.env.JWT_ACCESS_TIME});
  const refresh_token = GenerateRefreshToken(username);
  return res.json({status: true, message: 'success', data: {access_token, refresh_token}})

})


app.get('/dashboard', verifyToken, (req, res) => {
  return res.json({status: true, message: 'hello'})
})

app.get('/logout', verifyToken, (req, res) => {
  const username = req.userData?.sub;
  //remove the refresh token
  refreshTokens = refreshTokens.filter(x => x.username !== username)
  return res.json({status: true, message: 'success'})
})

function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: false,
        message: 'Authorization header missing'
      });
    }
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
    req.userData = decoded
    next();
  } catch(error) {
    return res.status(401).json({status: false, message: 'your session is not valid', data: error})
  }
}


function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
  
  const token = req.body.token;
  if(token === null) {

    return res.status(401).json({status: false, message: 'Invalid request'})

  }
  try {
    
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
    req.userData = decoded;
    let storedRefreshToken = refreshTokens.find(x => x.username === decoded.sub)
    
    if(storedRefreshToken === undefined) {
      return res.status(401).json({status: false, message: 'Invalid request. Token is not in store'})

    }
    if(storedRefreshToken.token !== token) {
      return res.status(401).json({status: false, message: 'Token is not the same'})

    }

    next();
  } catch(error) {
    return res.status(401).json({status: false, message: 'your session is not valid', data: error})
  }
}


function GenerateRefreshToken(username: string) {
  const refresh_token = jwt.sign({sub: username}, process.env.JWT_REFRESH_SECRET as string, {expiresIn: process.env.JWT_REFRESH_TIME})
    let storedRefreshToken = refreshTokens.find(x => x.username === username);

    if (storedRefreshToken === undefined) {
      // add it
        refreshTokens.push({
          username: username,
          token: refresh_token
        })
    } else {
      //update it
      refreshTokens[refreshTokens.findIndex(x => x.username === username)].token = refresh_token;
    }
    return refresh_token
}

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

export default app;
