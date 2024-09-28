import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"; // Assuming you want to use the jsonParser middleware
import logger from "morgan";
import cors from "cors";
import routes from "@routes/index";
import mongoose from "mongoose";
import TranslationModel, { ITranslation } from "models/translation";
import translationJson from "./translations.json";
import adminRouter from "./routes/admin-routes"; // Adjust path as needed
import dashboard from './routes/dashboard-routes'
import partnerRouter from "@routes/partner-routes";
import teacherRouter from "@routes/teacher-routes";
import tranlationRouter from "@routes/translate-routers";
// interface ITranslation {
//   original_language: string;
//   [key: string]: any; // Add other properties as needed
// }

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

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.use("/admin", adminRouter);
app.use("/auth", dashboard);
app.use("/web/api", routes); // use routes
app.use("/partner", partnerRouter);
app.use("/teacher", teacherRouter);
app.use("/translation", tranlationRouter);

interface MongoDate {
  $date: string;
}

// Type guard to check if the value is in MongoDB's date format
const isMongoDate = (value: any): value is MongoDate => {
  return value && typeof value === "object" && "$date" in value;
};
const startServer = async () => {
  try {
    // Assuming translationJson is an array of objects


    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  } catch (e) {
    console.log(e);
  }
};
startServer();
export default app;
