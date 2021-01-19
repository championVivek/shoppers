const route = require("express").Router();
const productsController = require("../controllers/admin_products");

route.post('/addproducts', productsController.addProduct)
route.post("/admin/:id/products", productsController.getProducts);
route.post("/admin/:id/deleteproducts", productsController.DeletProduct);
route.post("/admin/:id/geteditproduct", productsController.getEditProduct);
route.post("/admin/:id/editproduct", productsController.postEditProduct);

module.exports = route;
