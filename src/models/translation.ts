import mongoose, {Schema, Document} from 'mongoose';

interface ITranslation extends Document {
  text: string;
  translation?: string; // Optional field
  original_language: string;
  target_language: string;
  createdAt?: Date; // Optional field, will be managed by Mongoose if timestamps is true
  updatedAt?: Date; // Optional field, will be managed by Mongoose if timestamps is true
  isEdited?: boolean;
}

const translationSchema: Schema = new Schema(
  {
    text: {type: String, required: true},
    original_language: {type: String, required: true},
    target_language: {type: String, required: true},
    translation: {type: String, required: false}, // Optional field
    isEdited: {type: Boolean, default: false}, // New field, default to false
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
);

// Middleware to set isEdited to true on update
translationSchema.pre('save', function (next) {
  if (this.isModified() && this.isNew === false) {
    this.isEdited = true;
  }
  next();
});

const TranslationModel = mongoose.model<ITranslation>(
  'Translation',
  translationSchema,
);

export default TranslationModel;
