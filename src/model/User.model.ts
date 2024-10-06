import mongoose, { Schema } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  password: string;
  code: string;
  codeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  message: IMessage[];

  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
  content: { type: String, required: [true, "Content is required"] },
  createdAt: { type: Date, default: Date.now, required: true },
});

const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please use a valid email Address"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    match: [/^[a-zA-Z0-9]+$/, "Name is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be minimum 6 characters"],
  },
  code: { type: String, required: true },
  codeExpiry: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true, required: true },
  message: [MessageSchema],

  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
export default UserModel;
