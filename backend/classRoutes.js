const express = require("express");
const router = express.Router();
const Class = require("../models/Class");

// POST
router.post("/addClass", async (req, res) => {
  const newClass = new Class(req.body);
  await newClass.save();
  res.json({ message: "Saved" });
});

// GET
router.get("/getClasses", async (req, res) => {
  const data = await Class.find();
  res.json(data);
});

module.exports = router;