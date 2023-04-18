const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/order");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      /*cart: JSON.stringify(req.body.cartItems),*/
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        // multiplié par 100 car stripe prend le prix en centimes
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: { allowed_countries: ["FR"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "eur" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 1500, currency: "eur" },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 1 },
            maximum: { unit: "business_day", value: 1 },
          },
        },
      },
    ],
    customer: customer.id,
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/checkout-success",
    cancel_url: "http://localhost:3000/cart",
  });

  res.send({ url: session.url });
});

// CREATE ORDER
/* La commande est save dans la base de données avec le webhook de stripe,
// lorsqu'il voit que la session de payement s'est bien déroulée*/
const createOrder = async (customer, data, line_items) => {
  /*const items = JSON.parse(customer.metadata.cart);*/

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: line_items.data,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("commande saved: ", savedOrder);
    // email
  } catch (err) {
    console.log(err);
  }
};

// STRIPE WEBHOOKS

// This is your Stripe CLI webhook secret for testing your endpoint locally.

let endpointSecret;

/* // j'enlève le mot de passe pour le moment, car cela bug un peu,
 // cependant il faut le garder et résoudre le pb car c'est pas très safe sinon
// en faisant ça j'évite le try
endpointSecret =
  "whsec_e7c541b80c5ad02ffc3720d1dffcc31670c9fcdfd1f08357502a51e01e57af47";
*/

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Test Webhook marche");
      } catch (err) {
        console.log("Webhook erreur: ", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event

    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          /*console.log(customer);
          console.log("data: ", data);*/
          stripe.checkout.sessions.listLineItems(
            data.id,
            {},
            function (err, lineItems) {
              // asynchronously called
              console.log("line_items: ", lineItems);
              createOrder(customer, data, lineItems);
            }
          );
        })
        .catch((err) => console.log(err.message));
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
);

module.exports = router;
