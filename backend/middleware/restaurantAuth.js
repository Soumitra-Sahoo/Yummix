import jwt from "jsonwebtoken";

const restaurantAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized",
    });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    if (decoded.role !== "restaurant") {
      return res.json({
        success: false,
        message: "Restaurant Access Only",
      });
    }
    req.restaurantId = decoded.id;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default restaurantAuth;