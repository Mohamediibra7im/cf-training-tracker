import { Schema, model, models, Document } from "mongoose";
import crypto from "crypto";

export interface IRefreshToken extends Document {
  jti: string; // Unique token identifier
  userId: Schema.Types.ObjectId;
  token: string; // Hashed refresh token
  expiresAt: Date;
  deviceInfo?: string; // Optional device identifier
  ipAddress?: string; // Optional IP address
  revoked: boolean;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema: Schema = new Schema({
  jti: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  token: { type: String, required: true }, // Hashed token
  expiresAt: { type: Date, required: true, index: true },
  deviceInfo: { type: String },
  ipAddress: { type: String },
  revoked: { type: Boolean, default: false, index: true },
  revokedAt: { type: Date },
}, {
  timestamps: true,
});

// TTL index to auto-delete expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Helper function to generate a secure random token
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

// Helper function to hash the token for storage
export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default models.RefreshToken || model<IRefreshToken>("RefreshToken", RefreshTokenSchema);
