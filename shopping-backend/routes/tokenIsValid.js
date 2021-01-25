const route = require("express").Router();
const auth = require('../middleware/auth')
const tokenvalidtaioncontroller = require("../controllers/tokenIsValid");

route.post("/posttokenisvalid", tokenvalidtaioncontroller.postTokenIsValid);
route.get("/gettokenisvalid", auth.auth,tokenvalidtaioncontroller.getTokenIsValid);

module.exports = route;
