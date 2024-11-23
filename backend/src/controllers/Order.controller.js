// OrdersController.js
const CatchAsync = require("../utils/CatchAsync");
const OrderService = require("../services/Orders.service");

class OrdersController {
  static createOrder = CatchAsync(async (req, res) => {
    console.log("Incoming request body CONTROLLER:", req.body);
    const order = await OrderService.createOrder(req.user, req.body);
    return res.status(201).json(order);
  });

  static getAllorders = CatchAsync(async (req, res) => {
    const orders = await OrderService.getAllorders(req.user, req.query.page, req.query.query);
    return res.status(200).json(orders);
  });

  static deleteOrder = CatchAsync(async (req, res) => {
    const order = await OrderService.deleteOrder(req.user, req.params.id);
    return res.status(200).json(order);
  });

  static getInvoiceById = CatchAsync(async (req, res) => {
    const invoice = await OrderService.getInvoiceById(req.user, req.params.id);
    return res.status(200).json(invoice);
  });
}

module.exports = OrdersController;
