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

const buildNotificationFilter = (user) => {
  if (user.role === "Admin") {
    return { recipientRole: "Admin" };
  }

  return {
    recipientRole: user.role,
    recipientId: user._id,
  };
};

const getNotificationsForUser = async (user) => {
  const filter = buildNotificationFilter(user);
  return Notification.find(filter).sort({ createdAt: -1 }).limit(50);
};

const markNotificationAsRead = async (user, notificationId) => {
  const filter = {
    ...buildNotificationFilter(user),
    _id: notificationId,
  };

  return Notification.findOneAndUpdate(filter, { $set: { isRead: true } }, { new: true });
};

const markAllNotificationsAsRead = async (user) => {
  const filter = {
    ...buildNotificationFilter(user),
    isRead: false,
  };

  await Notification.updateMany(filter, { $set: { isRead: true } });
};

export {
  createNotification,
  getNotificationsForUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
};
