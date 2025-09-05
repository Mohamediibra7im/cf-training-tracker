import { Schema, model, models, Document } from "mongoose";

export interface IUserNotification extends Document {
  user: Schema.Types.ObjectId;
  notification: Schema.Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  isHidden: boolean;
}

const UserNotificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  notification: { type: Schema.Types.ObjectId, ref: "Notification", required: true },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  isHidden: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Compound index to ensure unique user-notification pairs
UserNotificationSchema.index({ user: 1, notification: 1 }, { unique: true });
UserNotificationSchema.index({ user: 1, isRead: 1 });

export default models.UserNotification || model<IUserNotification>("UserNotification", UserNotificationSchema);
