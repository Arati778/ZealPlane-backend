const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// Create a new notification
const createNotification = asyncHandler(async (req, res) => {
  const { userId, type, entityId, message } = req.body;

  // Validate that all required fields are provided
  if (!userId || !type || !entityId || !message) {
    res.status(400);
    throw new Error("User ID, type, entity ID, and message are required");
  }

  // Validate that the user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    res.status(404);
    throw new Error("User not found");
  }

  const newNotification = new Notification({
    userId,
    type,
    entityId,
    message,
  });

  const createdNotification = await newNotification.save();
  res.status(201).json(createdNotification);
});

// Get notifications for a user
const getNotificationsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });
  res.json(notifications);
});

// Mark a notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);

  if (notification) {
    notification.read = true;
    await notification.save();
    res.json({ message: "Notification marked as read" });
  } else {
    res.status(404);
    throw new Error("Notification not found");
  }
});

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
};
