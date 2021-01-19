const route = require("express").Router();

const cartcontroller = require("../controllers/cart");

route.post("/cart", cartcontroller.postCart);
route.post("/getcart", cartcontroller.getCart);
route.post("/gettotal", cartcontroller.totalPrice);
route.post("/deleteproductincart/:id", cartcontroller.postCartDeleteProduct);

module.exports = route;
