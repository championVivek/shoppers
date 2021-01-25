const user = require("../models/userData");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const Order = require("../models/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.getCheckout = async (req, res) => {
  try {
    const userId = req.body.userId;
    let products;
    let total = 0;
    const isUser = await user.findById(userId);
    if (!isUser) return res.status(404).json({ msg: "User not found" });
    const users = await isUser.populate("cart.items.productId").execPopulate();
    products = users.cart.items;
    products.forEach((p) => {
      total += p.quantity * p.productId.price;
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((p) => {
        return {
          name: p.productId.title,
          description: p.productId.description,
          amount: p.productId.price * 100,
          currency: "inr",
          quantity: p.quantity,
        };
      }),
      mode: "payment",
      success_url: `http://localhost:4000/postorder/${userId}`,
      cancel_url: "http://localhost:3000/checkout",
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const isUser = await user.findById(userId);
    const isProducts = await isUser
      .populate("cart.items.productId")
      .execPopulate();
    const products = isProducts.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });

    const result = await new Order({
      user: {
        email: isUser.email,
        userId: userId,
      },
      products: products,
      orderDate: Date.now(),
    }).save();

    if (result) {
      isUser.clearCart();

      res.redirect("http://localhost:3000/myorders");
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    const orders = await Order.find({ "user.userId": userId });

    if (!orders) {
      return res.status(404).json({ msg: "No orders available" });
    }
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

exports.getAPI = (req, res) => {
  const STRIPE_API = process.env.CLIENT_STRIPE_KEY;
  res.send(STRIPE_API);
};

exports.makeInvoice = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const userId = req.body.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new Error("No order found."));
    }
    const isUser = await user.findById(userId);
    if (order.user.userId.toString() !== isUser._id.toString()) {
      return next(new Error("Unauthorized"));
    }
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);
    const pdfDoc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline: filename="' + invoiceName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text("Invoice", {
      underline: true,
    });

    pdfDoc.text("----------------------------------------------");
    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          prod.product.title +
            "- Quantity: " +
            prod.quantity +
            " x " +
            "Rs. " +
            prod.product.price
        );
    });
    pdfDoc.text("--------");
    pdfDoc.fontSize(18).text("Total Price: Rs. " + totalPrice);
    pdfDoc.end();
  } catch (err) {
    res.status(500).json({ msg: "Server error. Please try again later!" });
  }
};

exports.getInvoice = (req, res) => {
  const orderId = req.body.orderId;
  res.sendFile(
    path.join(__dirname, "..", "data", "invoices", `invoice-${orderId}.pdf`)
  );
};
