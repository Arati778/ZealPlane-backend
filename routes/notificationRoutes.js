const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const ValidateToken = require("../midleware/validateTokenHandler");

const router = express.Router();

router.get('/', ValidateToken, getNotifications);
router.patch('/:notificationId/read', ValidateToken, markAsRead);

module.exports = router;
