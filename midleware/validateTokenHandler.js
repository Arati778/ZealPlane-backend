const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ValidateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; // Extract the token

    try {
      // Verify the access token
      const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded; // Attach decoded user info to request
      next(); // Proceed with the request
    } catch (err) {
      if (err.name === "TokenExpiredError") 
        {
        // Token expired, send a 401 response
        res.status(401);
        throw new Error("Access token expired. Please refresh the token.");
      } else {
        res.status(401);
        throw new Error("Invalid token.");
      }
    }
  } else {
    // If no token is provided
    res.status(401);
    throw new Error("No token provided.");
  }
});

module.exports = ValidateToken;
