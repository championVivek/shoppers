const adminData = require("../models/adminData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Signup
exports.signupAdmin = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!name) return res.status(400).json({ msg: "Name is required." });
    if (!email) return res.status(400).json({ msg: "Email is required." });
    if (!password)
      return res.status(400).json({ msg: "Password is required." });
      if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "Password length should be greater than 5." });
    const admin = await adminData.findOne({ email: email });
    if (admin) {
      return res.status(400).json({ msg: "Email already exist." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await new adminData({
      name: name,
      email: email,
      password: hashedPassword,
    }).save();
    res.status(200).json({ msg: "Admin created successfully" });
  } catch(err) {
    res.status(500).json({ msg: 'Server error. Please try again later!' });
  }
};

//Login
exports.loginAdmin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      if (!email) return res.status(400).json({ msg: "Email is required." });
      if (!password)
        return res.status(400).json({ msg: "Password is required." });
      const user = await adminData.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ msg: "Email or password is not correct." });
      }
      const doMatch = await bcrypt.compare(password, user.password);
      if (!doMatch) {
        return res.status(404).json({ msg: "Email or password is not correct." });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const result = await adminData.findById(user._id);
      if (result) {
        res.json({ token, user: { id: user._id, username: user.name}, isAdmin: true });
      }
    } catch (err) {
      res.status(500).json({ msg: 'Server error. Please try again later!' });
    }
  };
  