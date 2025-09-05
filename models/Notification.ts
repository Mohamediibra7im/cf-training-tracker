import { Schema, model, models, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  type: "announcement" | "new_feature" | "maintenance" | "update" | "alert";
  isActive: boolean;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  priority: "low" | "medium" | "high";
  targetAudience: "all" | "admins" | "users";
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  type: {
    type: String,
    enum: ["announcement", "new_feature", "maintenance", "update", "alert"],
    default: "announcement",
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
    required: true,
  },
  targetAudience: {
    type: String,
    enum: ["all", "admins", "users"],
    default: "all",
    required: true,
  },
  expiresAt: { type: Date },
}, {
  timestamps: true,
});

// Index for efficient querying
NotificationSchema.index({ isActive: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 });

export default models.Notification || model<INotification>("Notification", NotificationSchema);
