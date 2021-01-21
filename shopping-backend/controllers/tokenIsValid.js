const userData = require("../models/userData");
const adminData = require("../models/adminData");
const jwt = require("jsonwebtoken");

exports.postTokenIsValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    const isAdmin = req.header("isAdmin");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    if (isAdmin === false) {
      const user = await userData.findById(verified.id);
      if (!user) return res.json(false);
    }
    if (isAdmin === true) {
      const admin = await adminData.findById(verified.id);
      if (!admin) return res.json(false);
    }

    return res.json(true);
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

exports.getTokenIsValid = async (req, res) => {
  try {
    const isAdmin = req.header("isAdmin");

    const user =
      isAdmin === "false"
        ? await userData.findById(req.user)
        : await adminData.findById(req.user);

    res
      .status(200)
      .json({ id: user._id, username: user.name, isAdmin: isAdmin });
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};
