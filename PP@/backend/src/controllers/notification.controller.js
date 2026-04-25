import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getNotificationsForVendor,
  markAllVendorNotificationsAsRead,
  markVendorNotificationAsRead,
} from "../services/notification.service.js";

const fetchVendorNotifications = asyncHandler(async (req, res) => {
  const notifications = await getNotificationsForVendor(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

const readVendorNotification = asyncHandler(async (req, res) => {
  const notification = await markVendorNotificationAsRead(req.user._id, req.params.id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

const readAllVendorNotifications = asyncHandler(async (req, res) => {
  await markAllVendorNotificationsAsRead(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "All notifications marked as read"));
});

export { fetchVendorNotifications, readAllVendorNotifications, readVendorNotification };
