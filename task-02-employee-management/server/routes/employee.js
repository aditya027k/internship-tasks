const express = require("express");
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.json(emp);
});

router.get("/", auth, async (req, res) => {
  res.json(await Employee.find());
});

router.put("/:id", auth, async (req, res) => {
  res.json(await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", auth, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});

module.exports = router;
