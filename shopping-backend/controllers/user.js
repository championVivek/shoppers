const userData = require("../models/userData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Signup
exports.signupUser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!name) return res.status(400).json({ msg: "Name is required." });
    if (!email) return res.status(400).json({ msg: "Email is required." });
    if (!password)
      return res.status(400).json({ msg: "Password is required." });
    const user = await userData.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: "Email already exist." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await new userData({
      name: name,
      email: email,
      password: hashedPassword,
    }).save();
    res.status(200).json({ msg: "User created successfully" });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};


//Login
exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) return res.status(400).json({ msg: "Email is required." });
    if (!password)
      return res.status(400).json({ msg: "Password is required." });
    const user = await userData.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "Email or password is not correct." });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      return res.status(404).json({ msg: "Email or password is not correct." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const result = await userData.findById(user._id);
    if (result) {
      res.json({ token, user: { id: user._id, username: user.name}, isAdmin: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
