import { Schema, model } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    linkedInUrl: { type: String },
    linkedInProfile: {
      name: { type: String },
      photo: { type: String },
      profileUrl: { type: String },
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  { timestamps: true, collection: 'users' },
);

export const User = model('User', UserSchema);
