import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  getNotificationsForUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.service.js";

const fetchNotifications = asyncHandler(async (req, res) => {
  const notifications = await getNotificationsForUser(req.user);

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

const readNotification = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead(req.user, req.params.id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

const readAllNotifications = asyncHandler(async (req, res) => {
  await markAllNotificationsAsRead(req.user);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "All notifications marked as read"));
});

export { fetchNotifications, readAllNotifications, readNotification };
