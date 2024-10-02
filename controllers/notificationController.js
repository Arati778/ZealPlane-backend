const Notification = require("../models/notificationModel"); // Adjust path as necessary
const User = require("../models/userModel"); // Import the User model

// Fetch public notifications
const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ isPublic: true }) // Fetch only public notifications
      .populate("sender", "username")
      .sort({ createdAt: -1 }); // Sort notifications by creation date, latest first

    if (notifications.length === 0) {
      // If no notifications found, create a welcoming notification
      const welcomingMessage = "Welcome! There are currently no notifications.";
      const defaultSenderId = "YOUR_DEFAULT_SENDER_ID"; // Replace with a default sender ID

      const defaultNotification = new Notification({
        recipient: "PUBLIC_RECIPIENT_ID", // Replace with appropriate recipient ID or handle for public notifications
        sender: defaultSenderId,
        message: welcomingMessage,
        isPublic: true,
      });

      await defaultNotification.save();
      notifications = [defaultNotification]; // Add the welcoming notification to the response
    }

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create a notification
const createNotification = async (recipientId, senderId, message, projectId) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      message,
      projectId,
    });

    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true; // Mark as read
    await notification.save();

    return res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
};
