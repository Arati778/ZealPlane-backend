const express = require("express");
const validatePermissions = require("../midleware/validatePermissions");

const router = express.Router();

router.post("/:id", validatePermissions, (req, res) => {
  const { canView, canEdit } = req.permissions;

  if (canView) {
    res.json({
      message: "You can view this resource!",
      permissions: { canView, canEdit },
    });
    console.log("permision successfully verified!");
  } else {
    res.status(403).json({ message: "Access denied." });
  }
});

module.exports = router;
