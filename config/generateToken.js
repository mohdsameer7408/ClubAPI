import jwt from "jsonwebtoken";

const generateToken = (userData) =>
  jwt.sign(
    { _id: userData._id, email: userData.email },
    process.env.JWT_SECRET
  );

export default generateToken;
