import { Request, Response } from "express";
import Partner from "../models/partner";

const partnerCtrl = {
  createPartner: async (req: Request, res: Response) => {
    try {
      const newPartner = new Partner(req.body);
      const savedPartner = await newPartner.save();

      return res.status(201).json({
        status: true,
        message: "Partner created successfully.",
        data: savedPartner,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error creating partner",
        data: error,
      });
    }
  },
  listPartners: async (req: Request, res: Response) => {
    try {
      const partners = await Partner.find().sort({ createdAt: -1 }).exec();
      return res.status(200).json({
        status: true,
        data: partners,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error fetching partners",
        data: error,
      });
    }
  },
  getPartner: async (req: Request, res: Response) => {
    try {
      const partner = await Partner.findById(req.params.id).exec();
      if (!partner) {
        return res.status(404).json({
          status: false,
          message: "Partner not found",
        });
      }
      return res.status(200).json({
        status: true,
        data: partner,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error fetching partner",
        data: error,
      });
    }
  },
  updatePartner: async (req: Request, res: Response) => {
    try {
      const updatedPartner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updatedPartner) {
        return res.status(404).json({
          status: false,
          message: "Partner not found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Partner updated successfully",
        data: updatedPartner,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error updating partner",
        data: error,
      });
    }
  },
  deletePartner: async (req: Request, res: Response) => {
    try {
      const deletedPartner = await Partner.findByIdAndDelete(req.params.id).exec();
      if (!deletedPartner) {
        return res.status(404).json({
          status: false,
          message: "Partner not found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Partner deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error deleting partner",
        data: error,
      });
    }
  }


}

export default partnerCtrl;
