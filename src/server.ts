import dotenv from "dotenv";
import express, { Application } from "express";
import bodyParser from "body-parser"; // Assuming you want to use the jsonParser middleware
import logger from "morgan";
import cors from "cors";
import routes from "@routes/index";
// const { auth } = require('express-oauth2-jwt-bearer');

import cache from "./routeCache";

const app: Application = express();

dotenv.config();
app.use(cors());
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("json spaces", 4);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// app.use('/api/chinese-speaking', checkJwt, cache(300),  routes); // use routes
app.use("/web/api", cache(300), routes); // use routes

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

export default app;
