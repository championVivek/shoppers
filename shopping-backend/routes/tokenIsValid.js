const route = require("express").Router();
const auth = require('../middleware/auth')
const tokenvalidtaioncontroller = require("../controllers/tokenIsValid");

route.post("/tokenisvalid", tokenvalidtaioncontroller.postTokenIsValid);
route.get("/", auth.auth,tokenvalidtaioncontroller.getTokenIsValid);

module.exports = route;
