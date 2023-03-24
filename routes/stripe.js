const express = require("express");
const Stripe = require("stripe");

const stripe = Stripe(
  "sk_test_51MpBbmEEFghnI3izrYDkokUdBMAIZYnWEp3wJGeFR7F80j7qH17fd0fb44de3EldIcZ7up3VE5IJq9SZkyuKFr2q00ZqSns4EZ"
);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/checkout-success",
    cancel_url: "http://localhost:3000/cart",
  });

  res.send({ url: session.url });
});

module.exports = router;
