import mongoose, { Document, Schema } from 'mongoose';

export interface IReaction {
  userId: string;
  type: 'like' | 'celebrate' | 'support';
}

export interface IPost extends Document {
  userId: string;
  content: string;
  reactions: IReaction[];
  createdAt?: Date;
}

const ReactionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['like', 'celebrate', 'support'], required: true },
}, { _id: false });

const PostSchema: Schema = new Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  reactions: [ReactionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPost>('Post', PostSchema);
