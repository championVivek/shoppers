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
    if (!title) return res.status(404).json({ msg: "Title is required" });
    if (!price) return res.status(404).json({ msg: "Price is required" });
    if (!imageUrl)
      return res.status(404).json({ msg: "Image URL is required" });

    await new product({
      title: title,
      price: price,
      imageUrl: imageUrl,
      userId: adminId,
    }).save();

    res.status(200).json({ msg: "Product added successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

//get Products
exports.getProducts = async (req, res) => {
  try {
    const adminId = req.body.id;
    console.log(adminId);
    const admin = await adminData.findById(adminId);

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found." });
    }
    const products = await product.find({ userId: adminId });
    res.status(200).send(products);
    console.log(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

//Delete products
exports.DeletProduct = async (req, res) => {
  try {
    const adminId = req.params.id;
    const productId = req.body.productId;
    let productImage;

    //Delete the product
    const isProduct = await product.findById(productId);
    if (!isProduct) return res.status(404).json({ msg: "Product not found" });
    productImage = isProduct.imageUrl;
    const deleteProduct = await product.deleteOne({
      _id: productId,
      userId: adminId,
    });

    fs.unlink(productImage, (err) => {
      if (err) {
        res.status(500).json({ msg: "Error deleting image." });
      }
    });

    if (!deleteProduct) {
      return res.status(400).json({ msg: "Unable to delete product" });
    }
    //If succesful send back the products
    const products = await product.find({ userId: adminId });
    res
      .status(200)
      .json({ msg: "Product deleted successfully!", products: products });
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
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
    res.status(500).json({ msg: "Server error. Please try again later!" });
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
    res.status(200).json({ msg: "Product updated successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};
