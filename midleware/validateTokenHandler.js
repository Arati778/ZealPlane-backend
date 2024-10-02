const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ValidateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization; // Check both lowercase and uppercase headers

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401); // Change to 401 (Unauthorized)
        throw new Error("Invalid token. User is not authorized!");
      }

      // Attach decoded user information to the request
      req.user = decoded;
      next(); // Move to the next middleware or route handler
    });
  } else {
    // If no token is present or it's invalid
    res.status(401);
    throw new Error("User not authorized, no token provided");
  }
});

module.exports = ValidateToken;
