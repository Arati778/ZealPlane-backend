const express = require("express");
const router = express.Router();
const {
  submitReport,
  getReports,
  resolveReport,
} = require("../controllers/reportController");
const ValidateToken = require("../midleware/validateTokenHandler");

// Submit a report
router.post("/:projectId/report", submitReport);

// Get all reports (admin access)
router.get("/admin", ValidateToken, getReports);

// Resolve a report (admin access)
router.put("/admin/:reportId/resolve", ValidateToken, resolveReport);

module.exports = router;
