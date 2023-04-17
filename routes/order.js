const express = require("express");
const { Order } = require("../models/order");
//const cloudinary = require("../utils/cloudinary");
const { auth, isAdmin } = require("../middleware/auth");

const router = express.Router();

// SAVE ORDER
// isAdmin est la fonction middleware pour vérifier l'autentification
router.post("/", async (req, res) => {
  const { userId, cartItems, subtotal } = req.body;

  try {
    const order = new Order({
      userId: userId,
      products: cartItems,
      subtotal: subtotal,
    });
    const savedOrder = await order.save();
    console.log("Commande enregistré", savedOrder);
    res.status(200).send(savedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ORDERS
router.get("/", isAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });

    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ONE ORDER
router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (req.user._id !== order.userId || !req.user.isAdmin)
      return res.status(403).send("Accès interdit. Non autorisé ...");

    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// EDIT ORDERS
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateOrder);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
