import express, { Request, Response } from "express";
import Teacher from "../models/teacher";


const teacherCtrl = {
    createTeacher: async (req: Request, res: Response) => {
        try {
            const newTeacher = new Teacher(req.body);
            const savedTeacher = await newTeacher.save();
      
            return res.status(201).json({
              status: true,
              message: "Teacher created successfully.",
              data: savedTeacher,
            });
          } catch (error) {
            return res.status(500).json({
              status: false,
              message: "Error creating teacher",
              data: error,
            });
          }
    },

    listTeacher: async (req: Request, res: Response) => {
        try {
            const teachers = await Teacher.find().exec();
            return res.status(200).json({ status: true, data: teachers });
        } catch (error) {
            return res.status(500).json({ status: false, message: "Error fetching teachers", data: error });
        }
    },

    getTeacher: async (req: Request, res: Response) => {
        
        try {
        
            const teacher = await Teacher.findById(req.params.id).exec();
            if (!teacher) {
                return res.status(404).json({ status: false, message: "Teacher not found."})
            }
           
            return res.status(200).json({status: true, data: teacher});
            
        }
        catch (error) {
            return res.status(500).json({status: false, message: "Error fetch teacher", data: error})
        }
        
    },

    updateTeacher: async (req: Request, res: Response) => {
        try {
            const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
            if (!updatedTeacher) {
                return res.status(404).json({ status: false, message: "Teacher not found" });
              }
              return res.status(200).json({ status: true, data: updatedTeacher });
        } catch (error) {
              return res.status(500).json({ status: false, message: "Error updating teacher", data: error });
        
        }
    },

    deleteTeacher: async (req: Request, res: Response) => {
        try {
            const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id).exec();
            if (!deletedTeacher) {
                return res.status(404).json({ status: false, message: "Teacher not found" });
              }
              return res.status(200).json({ status: true, message: "Teacher deleted successfully" });
        } catch (error) {
              return res.status(500).json({ status: false, message: "Error deleting teacher", data: error });
        }
    }


}

export default teacherCtrl;