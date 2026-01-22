const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Default Admin Creation
router.post("/login", async (req, res) => {
  let admin = await User.findOne({ username: req.body.username });
  if (!admin) {
    admin = new User({
      username: "admin",
      password: await bcrypt.hash("admin123", 10)
    });
    await admin.save();
  }

  const valid = await bcrypt.compare(req.body.password, admin.password);
  if (!valid) return res.status(400).json({ message: "Invalid login" });

  const token = jwt.sign({ role: "admin" }, "secretkey");
  res.json({ token });
});

module.exports = router;
