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
    const { page, query, startDate, endDate } = req.query;
  
    const orders = await OrderService.getAllorders(
      req?.user,
      page,
      query,
      startDate,
      endDate
    );
  
    return res.status(200).json(orders);
  });

  static getEveryOrder = CatchAsync(async (req, res) => {
    const orders = await OrderService.getEveryOrder(req?.user);
    return res.status(200).json(orders);
  });

  static updateById = CatchAsync(async (req, res) => {
    const orders = await OrderService.updateById( req.params.id, req.body);
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

  static getMostAppeared = CatchAsync(async (req, res) => {
    console.log("Incoming request body CONTROLLER:", req.body);
    const order = await OrderService.getMostAppeared(req.user, req.body);
    return res.status(201).json(order);
  });

  static WeeklyRevenue = CatchAsync(async (req, res) => {
    console.log("Incoming request body CONTROLLER:", req.body);
    const order = await OrderService.WeeklyRevenue(req.user, req.body);
    return res.status(201).json(order);
  });

}

module.exports = OrdersController;
