import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"; // Assuming you want to use the jsonParser middleware
import logger from "morgan";
import cors from "cors";
import routes from "@routes/index";
// const { auth } = require('express-oauth2-jwt-bearer');
import mongoose from "mongoose";
// import auth_routes from "./routes/index";
// import admin_routes from "./routes/dashboard-routes";

const app: Application = express();

mongoose
  .connect(process.env.DB_CONN_STRING as string)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("Connection error", err));

dotenv.config();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("json spaces", 4);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5501;

// app.use("/v1/auth", auth_routes);
// app.use("/v1/user", admin_routes);

// app.use('/api/chinese-speaking', checkJwt, cache(300),  routes); // use routes
app.use("/web/api", routes); // use routes

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

export default app;
