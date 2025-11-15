router.get("/me/overview", hospitalAuth, async (req, res) => {
  const hospital = req.hospital;

  res.json({
    name: hospital.name,
    verified: hospital.verified,
    bedsAvailable: hospital.bedsAvailable,
    services: hospital.services,
    location: hospital.location
  });
});
