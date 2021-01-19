const fs = require("fs");
const adminData = require("../models/adminData");
const product = require("../models/products");

//Add Product
exports.addProduct = async (req, res) => {
  try {
    const title = req.body.title;
    const price = req.body.price;
    const image = req.file;
    const adminId = req.body.id;

    const imageUrl = image.path;

    const admin = await adminData.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    await new product({
      title: title,
      price: price,
      imageUrl: imageUrl,
      userId: adminId,
    }).save();

    res.status(200).json({ msg: "Product added successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

//get Products
exports.getProducts = async (req, res) => {
  try {
    const adminId = req.params.id;

    const admin = await adminData.findById(adminId);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found." });
    }
    const products = await product.find({ userId: adminId });
    res.status(200).send(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//Delete products
exports.DeletProduct = async (req, res) => {
  try {
    const adminId = req.params.id;
    const productId = req.body.productId;
    let productImage;

    const isProduct = await product.findById(productId);
    if (!isProduct) return res.status(404).json({ msg: "Product not found" });
    productImage = isProduct.imageUrl;
    fs.unlink(productImage, (err) => {
      if (err) {
        res.status(500).json({ msg: err.message });
      }
    });

    const deleteProduct = await product.deleteOne({
      _id: productId,
      userId: adminId,
    });

    if (!deleteProduct) {
      return res.status(400).json({ msg: "Unable to delete product" });
    }
    res.status(200).json({ msg: "Product deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

//get Product to be edited

exports.getEditProduct = async (req, res, next) => {
  try {
    productId = req.params.id;

    const isProduct = await product.findById(productId);
    if (!isProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).send(isProduct);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//Update product

exports.postEditProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const adminId = req.body.adminId;
    const title = req.body.title;
    const price = req.body.price;
    const image = req.file;

    const imageUrl = image.path;

    const admin = await adminData.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found." });

    const updated = await product.updateOne(
      { _id: productId, userId: adminId },
      {
        $set: {
          title: title,
          price: price,
          imageUrl: imageUrl,
        },
      }
    );
    if (!updated) return res.status(400).json({ msg: "Unable to update." });
    res.status(200).json({ msg: "Update successful." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
