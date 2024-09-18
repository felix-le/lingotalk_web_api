import mongoose, { Schema, Document } from "mongoose";

export interface ITranslation extends Document {
  text: string;
  translation?: string; // Optional field
  original_language: string;
  target_language: string;
  createdAt?: Date; // Mongoose will manage this field as a Date object
  updatedAt?: Date; // Mongoose will manage this field as a Date object
  isEdited?: boolean;
}
const translationSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    original_language: { type: String, required: true },
    target_language: { type: String, required: true },
    translation: { type: String, required: false }, // Optional field
    isEdited: { type: Boolean, default: false }, // New field, default to false
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

translationSchema.pre("save", function (next) {
  if (!this.original_language) {
    // Ignore saving if original_language is null or undefined
    console.warn(
      "original_language is missing, ignoring save for this document."
    );
    return next(new Error("original_language is required."));
  }

  if (this.isModified() && this.isNew === false) {
    this.isEdited = true;
  }
  next();
});

const TranslationModel = mongoose.model<ITranslation>(
  "Translation",
  translationSchema
);

export default TranslationModel;
