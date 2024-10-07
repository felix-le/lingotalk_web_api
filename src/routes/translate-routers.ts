import express, { Router } from "express";
import translationCtrl from "../controllers/translationCtrl";

const tranlationRouter: Router = express.Router();

tranlationRouter.post("/create", translationCtrl.createTranslation)
tranlationRouter.get("/list", translationCtrl.getAllTranslations)
tranlationRouter.put("/update/:id", translationCtrl.updateTranslation)
tranlationRouter.delete("/delete/:id", translationCtrl.deleteTranslation)
export default tranlationRouter;