const route = require("express").Router();
const user = require("../controllers/user");

route.post("/usersignup", user.signupUser);
route.post("/userlogin", user.loginUser)

module.exports = route;
