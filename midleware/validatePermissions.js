const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Middleware to validate token and assign permissions
const validatePermissions = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; // Extract token

    try {
      // Verify and decode the token
      const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const { uniqueId } = decoded;

      // Check if uniqueId matches the required one (Assume you get `requestedUniqueId` from req.body or params)
      const requestedUniqueId = req.body.id || req.params.id;

      if (uniqueId === requestedUniqueId) {
        // Grant both permissions
        req.permissions = {
          canView: true,
          canEdit: true,
        };
      } else {
        // Restrict permissions
        req.permissions = {
          canView: true, // Maybe allow viewing
          canEdit: false, // Disallow editing
        };
      }

      req.user = decoded; // Attach decoded token info to request
      next(); // Proceed to the next middleware or controller

    } catch (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401);
        throw new Error("Access token expired. Please refresh the token.");
      } else {
        res.status(401);
        throw new Error("Invalid token.");
      }
    }
  } else {
    res.status(401);
    throw new Error("No token provided.");
  }
});

module.exports = validatePermissions;
