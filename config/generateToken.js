import jwt from "jsonwebtoken";

const generateToken = (userData) =>
  jwt.sign(
    { _id: userData._id, email: userData.email, userType: userData.userType },
    process.env.JWT_SECRET
  );

export default generateToken;
