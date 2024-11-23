const express = require("express");
const Authentication = require("../middlewares/Authentication");
const Validation = require("../middlewares/Validation");
const { CreateOrder } = require("../validations/Order.validation");
const OrdersController = require("../controllers/Order.controller");
const router = express.Router();

router.use(Authentication); // Authentication applied to all routes

// Create Order route with validation and authentication
// router.route("/create-order")
//     .post(
//         CreateOrder,        // Order validation
//         Validation,         // Validation middleware
//         OrdersController.createOrder // Controller to handle order creation
//     );

    router.post('/create-order', OrdersController.createOrder);

// Get all orders route
router.route("/get-orders")
    .get(OrdersController.getAllorders);

// Get invoice by ID route
router.route("/get-invoice/:id")
    .get(OrdersController.getInvoiceById);

// Delete order route
router.route("/delete/:id")
    .delete(OrdersController.deleteOrder);

module.exports = router;
