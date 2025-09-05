import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  codeforcesHandle: string;
  password: string;
  rating: number;
  avatar: string;
  rank: string;
  maxRating: number;
  maxRank: string;
  organization: string;
  lastSyncTime: number;
  role: "user" | "admin";
}

const UserSchema: Schema = new Schema({
  codeforcesHandle: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rating: { type: Number, default: 0 },
  avatar: { type: String, required: true },
  rank: { type: String, required: true, default: "Unrated" },
  maxRating: { type: Number, default: 0 },
  maxRank: { type: String, default: "Unrated" },
  organization: { type: String },
  lastSyncTime: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default models.User || model<IUser>("User", UserSchema);
