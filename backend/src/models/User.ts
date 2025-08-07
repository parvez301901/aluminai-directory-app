import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkUserId: string;
  name: string;
  email: string;
  avatar?: string;
  graduationYear?: number;
  department?: string;
  jobTitle?: string;
  location?: string;
  group?: string;
  createdAt?: Date;
}

const UserSchema: Schema = new Schema({
  clerkUserId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String },
  graduationYear: { type: Number },
  department: { type: String },
  jobTitle: { type: String },
  location: { type: String },
  group: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
