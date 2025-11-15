const jwt = require("jsonwebtoken");
const Hospital = require("../models/hospitalModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Hospital Not Authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hospital = await Hospital.findById(decoded.id);
    if (!hospital) return res.status(404).json({ error: "Hospital doesn't exist" });

    req.hospital = hospital;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
