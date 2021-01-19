const route = require("express").Router();
const adminController = require("../controllers/admin");

route.post("/adminsignup", adminController.signupAdmin);
route.post('/adminlogin', adminController.loginAdmin);

module.exports = route;
