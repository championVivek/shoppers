const route = require("express").Router()
const orderController = require("../controllers/order")

route.post("/checkout", orderController.getCheckout)
route.get("/postorder/:id", orderController.postOrder)
route.post("/myorders", orderController.getOrder)
route.get("/sendpikey", orderController.getAPI)
route.post("/makeinvoice", orderController.makeInvoice)
route.post("/getinvoice", orderController.getInvoice)
module.exports = route