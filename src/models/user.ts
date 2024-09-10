import mongoose, { Schema, model, Document } from 'mongoose';

// Define an interface to represent the User document
interface IUser extends Document {
    username: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: { 
        type: String, 
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true
    }
})


const User = mongoose.model<IUser>('User', userSchema);
export default User;