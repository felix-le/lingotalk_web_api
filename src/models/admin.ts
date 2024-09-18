import mongoose, { Schema, model, Document } from "mongoose";

// Define an interface to represent the User document
export interface IUser extends Document {
  username: string;
  password: string;
  level?: number;
  original_language?: string;
  learning_language?: string;
  _id: Schema.Types.ObjectId;
  isActive: boolean;
}

const userSchema = new Schema<IUser>({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
  },
  level: { type: Number, default: 0 }, // 0 is mod
  original_language: { type: String, default: "English" }, // 0 is mod
  learning_language: { type: String, default: "English" }, // 0 is mod
  isActive: { type: Boolean, default: true },
});

const Admin = mongoose.model<IUser>("Admin", userSchema);
export default Admin;
