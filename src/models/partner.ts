import mongoose, { Schema, Document } from "mongoose";

// Define the Partner interface
export interface IPartner extends Document {
  name: string;
  link?: string;
  permission: string;
  isActive: boolean;
  market_location: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  percentages?: number;
  province: string;
  country: string;
  referenceUserCount?: number;
  type: string;
  contractStartDate: Date;
  contractEndDate: Date;
  paymentMethod: string;
  paymentDetails?: string;
  rating?: number;
  createdBy: string;
  updatedBy?: string;
  specialization?: string;
  serviceArea?: string;
  website?: string;
  socialMediaLinks?: string[];
}

const partnerSchema = new Schema<IPartner>({
  name: { type: String, required: true },
  link: { type: String },
  permission: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  market_location: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  percentages: { type: Number },
  province: { type: String, required: true },
  country: { type: String, required: true },
  referenceUserCount: { type: Number },
  type: { type: String, required: true },
  contractStartDate: { type: Date, required: true },
  contractEndDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: String },
  rating: { type: Number },
  createdBy: { type: String, required: true },
  updatedBy: { type: String },
  specialization: { type: String },
  serviceArea: { type: String },
  website: { type: String },
  socialMediaLinks: { type: [String] },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Partner = mongoose.model<IPartner>("Partner", partnerSchema);
export default Partner;