import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipientRole: {
      type: String,
      enum: ["User", "Admin", "Vendor"],
      required: true,
      index: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    actorRole: {
      type: String,
      enum: ["User", "Admin", "Vendor", "System"],
      default: "System",
    },
    actorId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      default: "",
      trim: true,
    },
    entityId: {
      type: String,
      default: "",
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = mongoose.model("Notification", notificationSchema);
