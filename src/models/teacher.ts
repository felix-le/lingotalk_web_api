import mongoose, { Schema, Document } from "mongoose";

// Define the Teacher interface
export interface ITeacher extends Document {
  name: string;
  link: string;
  commission?: number;
  isActive: boolean;
  personal_email: string;
  phone: string;
  address?: string;
  description?: string;
  percentages?: number;
  isPartner?: boolean;
  schoolEmailAddress?: string;
  schoolName?: string;
  country?: string;
  city?: string;
  province?: string;
  subjectSpecialization?: string;
  yearsOfExperience?: number;
  bio?: string;
  languagesSpoken?: string[];
  availability?: string; // Could be a time range or a detailed structure
  linkedinProfile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the Teacher schema
const teacherSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
    commission: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    personal_email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    description: { type: String },
    percentages: { type: Number },
    isPartner: { type: Boolean, default: false },
    schoolEmailAddress: { type: String },
    schoolName: { type: String },
    country: { type: String },
    city: { type: String },
    province: { type: String },
    subjectSpecialization: { type: String },
    yearsOfExperience: { type: Number },
    bio: { type: String },
    languagesSpoken: [{ type: String }],
    availability: { type: String },
    linkedinProfile: { type: String },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
export default Teacher;