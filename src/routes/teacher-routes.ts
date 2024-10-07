import express, { Router } from "express";
import teacherCtrl from "../controllers/teacherCtrl";

const teacherRouter: Router = express.Router();

teacherRouter.post("/create", teacherCtrl.createTeacher)
teacherRouter.get("/list", teacherCtrl.listTeacher)
teacherRouter.get("/get/:id", teacherCtrl.getTeacher)
teacherRouter.put("/update/:id", teacherCtrl.updateTeacher)
teacherRouter.delete("/delete/:id", teacherCtrl.deleteTeacher )
export default teacherRouter;