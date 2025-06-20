const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send({ message: "Authorization header is missing" });
  }

  // Split the "Bearer" part and get the token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  console.log("Token is here:", token); // Log the token to ensure it's correct

  try {
    // Verify the token using the secret
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Payload:", payload); // Log the decoded payload

    req.userID = payload.userID; // Assuming the payload contains 'userID'

    next(); // Call next() to proceed with the request
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).send({ message: "Invalid or expired token" });
  }
}

module.exports = authenticateToken;
