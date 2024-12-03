const Report = require("../models/reportModel");

// Submit a report
exports.submitReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res
        .status(400)
        .json({ error: "Reason must be at least 10 characters long." });
    }

    const report = new Report({
      projectId,
      reportedBy: req.user.id, // Assuming `req.user` contains the authenticated user
      reason,
    });

    await report.save();
    res.status(201).json({ message: "Report submitted successfully." });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Get all reports (admin feature)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("projectId", "name description")
      .populate("reportedBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Resolve a report (admin feature)
exports.resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status: "Resolved" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    res.status(200).json({ message: "Report resolved successfully.", report });
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};
