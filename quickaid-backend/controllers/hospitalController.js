const Hospital = require("../models/hospitalModel");

// -----------------------------------------
// CREATE NEW HOSPITAL
// -----------------------------------------
exports.createHospital = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      lat,
      lng,
      address,
      bedsAvailable,
      services,
      emergencyContact,
      open24x7
    } = req.body;

    if (!name || !phone || !lat || !lng) {
      return res.status(400).json({ error: "name, phone, lat, lng are required" });
    }

    const hospital = await Hospital.create({
      name,
      contact: { phone, email },
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
        address
      },
      bedsAvailable: bedsAvailable || 0,
      services: services || [],
      emergencyContact,
      open24x7: open24x7 ?? true
    });

    return res.status(201).json({
      message: "Hospital created successfully",
      hospital
    });
  } catch (error) {
    console.log("❌ Hospital Create Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// -----------------------------------------
// GET ALL HOSPITALS
// -----------------------------------------
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    return res.json(hospitals);
  } catch (error) {
    console.log("❌ Get Hospitals Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// -----------------------------------------
// GET HOSPITAL BY ID
// -----------------------------------------
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    return res.json(hospital);
  } catch (error) {
    console.log("❌ Get Hospital Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// -----------------------------------------
// UPDATE HOSPITAL
// -----------------------------------------
exports.updateHospital = async (req, res) => {
  try {
    const updates = req.body;
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, updates, {
      new: true
    });

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    return res.json({
      message: "Hospital updated",
      hospital
    });
  } catch (error) {
    console.log("❌ Update Hospital Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// -----------------------------------------
// DELETE HOSPITAL
// -----------------------------------------
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    return res.json({ message: "Hospital deleted" });
  } catch (error) {
    console.log("❌ Delete Hospital Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// -----------------------------------------
// UPDATE AVAILABLE BEDS
// -----------------------------------------
exports.updateBeds = async (req, res) => {
  try {
    const { bedsAvailable } = req.body;

    if (bedsAvailable === undefined) {
      return res.status(400).json({ error: "bedsAvailable required" });
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { bedsAvailable },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    return res.json({
      message: "Bed availability updated",
      hospital
    });
  } catch (error) {
    console.log("❌ Update Beds Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// -----------------------------------------
// FIND NEARBY HOSPITALS (Geo Search)
// -----------------------------------------
exports.findNearbyHospitals = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius default 5km

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng required" });
    }

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) // meters
        }
      }
    }).limit(20);

    return res.json(hospitals);
  } catch (error) {
    console.log("❌ Nearby Hospital Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


// VERIFY HOSPITAL (Admin or Staff Only)

exports.verifyHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    return res.json({
      message: "Hospital verified",
      hospital
    });
  } catch (error) {
    console.log("❌ Verify Hospital Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
