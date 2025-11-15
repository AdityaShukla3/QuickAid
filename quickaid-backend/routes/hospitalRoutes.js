const express = require("express");
const router = express.Router();

const hospitalAuth = require("../middleware/hospitalAuth");
const { hospitalSignup, hospitalLogin } = require("../controllers/hospitalAuthController");
const {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
  updateBeds,
  findNearbyHospitals,
  verifyHospital
} = require("../controllers/hospitalController");

// AUTH
router.post("/signup", hospitalSignup);
router.post("/login", hospitalLogin);

// CRUD
router.post("/", hospitalAuth, createHospital);
router.get("/", getHospitals);
router.get("/:id", getHospitalById);

// UPDATES
router.put("/:id", hospitalAuth, updateHospital);
router.patch("/:id/beds", hospitalAuth, updateBeds);

// GEO SEARCH
router.get("/nearby", findNearbyHospitals);

// VERIFY (Admin)
router.patch("/:id/verify", verifyHospital);

module.exports = router;
