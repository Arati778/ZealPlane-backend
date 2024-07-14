const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
} = require('../controllers/notificationController');

router.post('/', createNotification);
router.get('/:userId', getNotificationsByUserId);
router.put('/:notificationId/read', markNotificationAsRead);

module.exports = router;
