import jwt from "jsonwebtoken";

const riderAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "rider") {
      return res.json({ success: false, message: "Rider access only" });
    }
    req.riderId = decoded.id;
    next();
  } catch (error) {
    console.error("riderAuth error:", error);
    res.json({ success: false, message: "Invalid Token" });
  }
};

export default riderAuth;