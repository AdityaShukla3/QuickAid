const Hospital = require("../models/hospitalModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id, role: "hospital" }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.hospitalSignup = async (req, res) => {
  try {
    const { name, phone, email, password, lat, lng, address } = req.body;

    if (!name || !phone || !email || !password || !lat || !lng) {
      return res.status(400).json({ error: "All fields required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const hospital = await Hospital.create({
      name,
      contact: { phone, email },
      password: hashed,
      location: {
        type: "Point",
        coordinates: [lng, lat],
        address
      },
      verified: false
    });

    res.json({
      message: "Hospital registered",
      token: generateToken(hospital._id),
      hospital
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.hospitalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await Hospital.findOne({ "contact.email": email });
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });

    const match = await bcrypt.compare(password, hospital.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    res.json({
      message: "Login success",
      token: generateToken(hospital._id),
      hospital
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
