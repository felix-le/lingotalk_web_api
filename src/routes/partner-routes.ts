import express, { Router } from "express";
import partnerCtrl from "../controllers/partnerCtrl";

const partnerRouter: Router = express.Router();

partnerRouter.post("/create", partnerCtrl.createPartner)
partnerRouter.get("/list", partnerCtrl.listPartners)
partnerRouter.get("/get/:id", partnerCtrl.getPartner)
partnerRouter.put("/update/:id", partnerCtrl.updatePartner)
partnerRouter.delete("/delete/:id", partnerCtrl.deletePartner )
export default partnerRouter;
