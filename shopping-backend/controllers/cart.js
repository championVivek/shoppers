const product = require("../models/products");
const user = require("../models/userData");

exports.postCart = async (req, res) => {
  try {
    const productId = req.body.id;
    const userId = req.body.userId;
    let products;
    let totalQuantity = 0;

    const isProduct = await product.findById(productId);
    if (isProduct) {
      const isUser = await user.findById(userId);
      isUser.addToCart(isProduct);
      const users = await isUser
        .populate("cart.items.productId")
        .execPopulate();
      products = users.cart.items;
      products.forEach((p) => {
        totalQuantity += p.quantity;
      });

      res.status(200).json({ totalQuantity: totalQuantity });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    const isUser = await user.findById(userId);
    if (!isUser) return res.status(404).json({ msg: "User not found" });
    const users = await isUser.populate("cart.items.productId").execPopulate();
    res.status(200).send(users.cart.items);
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

exports.totalPrice = async (req, res) => {
  try {
    const userId = req.body.userId;
    let products;
    let total = 0;
    let totalQuantity = 0;
    const isUser = await user.findById(userId);
    if (!isUser) return res.status(404).json({ msg: "User not found" });
    const users = await isUser.populate("cart.items.productId").execPopulate();
    products = users.cart.items;
    products.forEach((p) => {
      total += p.quantity * p.productId.price;
      totalQuantity += p.quantity;
    });

    res.status(200).json({ total: total, totalQuantity: totalQuantity });
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const userId = req.params.id;
    const isUser = await user.findById(userId);
    const result = await isUser.removeFromCart(prodId);
    if (!result) {
      return res.status(400).json({ msg: "Error deleting product" });
    }
    const users = await isUser.populate("cart.items.productId").execPopulate();
    res.status(200).send(users.cart.items);
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};
