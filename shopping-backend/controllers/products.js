const product = require("../models/products")

exports.getProducts = async (req, res, next) => {
  try {
    
    const products = await product.find({});
    if (!products) {
      return res.status(404).json({ msg: "No products" });
    }
    res.status(200).send(products)
  } catch (err) {
    console.log(err.message);
  }
};
