import { Notification } from "../models/notification.model.js";

const createNotification = async ({
  recipientRole,
  recipientId = null,
  actorRole = "System",
  actorId = null,
  title,
  message,
  entityType = "",
  entityId = "",
  metadata = {},
}) => {
  if (!recipientRole || !title || !message) {
    return null;
  }

  return Notification.create({
    recipientRole,
    recipientId,
    actorRole,
    actorId,
    title,
    message,
    entityType,
    entityId,
    metadata,
  });
};

const getNotificationsForVendor = async (vendorId) =>
  Notification.find({
    recipientRole: "Vendor",
    recipientId: vendorId,
  })
    .sort({ createdAt: -1 })
    .limit(50);

const markVendorNotificationAsRead = async (vendorId, notificationId) =>
  Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipientRole: "Vendor",
      recipientId: vendorId,
    },
    { $set: { isRead: true } },
    { new: true },
  );

const markAllVendorNotificationsAsRead = async (vendorId) => {
  await Notification.updateMany(
    {
      recipientRole: "Vendor",
      recipientId: vendorId,
      isRead: false,
    },
    { $set: { isRead: true } },
  );
};

export {
  createNotification,
  getNotificationsForVendor,
  markAllVendorNotificationsAsRead,
  markVendorNotificationAsRead,
};
