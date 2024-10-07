import { Request, Response } from 'express';
import TranslationModel from '../models/translation';

const translationCtrl = {
    createTranslation: async (req: Request, res: Response) => {
        const { text, original_language, target_language, translation } = req.body;
      
        try {
          const newTranslation = new TranslationModel(
            req.body
          );
      
          const savedTranslation = await newTranslation.save();
          return res.status(201).json({ status: true, data: savedTranslation });
        } catch (error) {
          return res.status(500).json({ status: false, message: 'Error creating translation', error });
        }
    },

    getAllTranslations: async (req: Request, res: Response) => {
        try {
          const translations = await TranslationModel.find()
            .sort({ original_language: 1, target_language: 1 })
            .exec();
          return res.status(200).json({ status: true, data: translations });
        } catch (error) {
          return res.status(500).json({ status: false, message: 'Error fetching translations', error });
        }
    },

    updateTranslation: async (req: Request, res: Response) => {
        const { id } = req.params;
        const updateData = req.body;
      
        try {
          const updatedTranslation = await TranslationModel.findByIdAndUpdate(id, updateData, {
            new: true,
          }).exec();
          if (!updatedTranslation) {
            return res.status(404).json({ status: false, message: 'Translation not found' });
          }
          return res.status(200).json({ status: true, data: updatedTranslation });
        } catch (error) {
          return res.status(500).json({ status: false, message: 'Error updating translation', error });
        }
    },

    deleteTranslation: async (req: Request, res: Response) => {
        const { id } = req.params;
      
        try {
          const deletedTranslation = await TranslationModel.findByIdAndDelete(id).exec();
          if (!deletedTranslation) {
            return res.status(404).json({ status: false, message: 'Translation not found' });
          }
          return res.status(200).json({ status: true, message: 'Translation deleted' });
        } catch (error) {
          return res.status(500).json({ status: false, message: 'Error deleting translation', error });
        }
    },

}

export default translationCtrl;