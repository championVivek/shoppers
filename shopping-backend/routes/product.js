const route = require("express").Router();
const ProductsController = require("../controllers/products");

route.get("/products", ProductsController.getProducts);

module.exports = route;