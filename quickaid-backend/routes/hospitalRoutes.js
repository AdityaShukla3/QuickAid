const express = require("express");
const router = express.Router();

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

// CRUD
router.post("/", createHospital);
router.get("/", getHospitals);
router.get("/:id", getHospitalById);
router.put("/:id", updateHospital);
router.delete("/:id", deleteHospital);

// Bed update
router.patch("/:id/beds", updateBeds);

// Nearby search
router.get("/location/nearby/search", findNearbyHospitals);

// Verify hospital
router.patch("/:id/verify", verifyHospital);

module.exports = router;
