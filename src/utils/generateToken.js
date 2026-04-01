import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;

  return jwt.sign(
    { userId, role },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export default generateToken;
