const httpStatus = require("http-status");
const { OrdersModel } = require("../models");
const ApiError = require("../utils/ApiError");
const ProductService = require("../services/Product.service");  // Import ProductService

class OrderService {


  static async createOrder(user, body) {
    // Check if items exist in the body and log
    console.log("Received items in body: ", body.items);

    if (!body.items || body.items.length === 0) {
      throw new ApiError(400, "Items are required");
    }

    // Validate stock for all items
    const itemsToCreate = []; // Array to store the items being created in the order
    for (const item of body.items) {
      // Validate that productId and quantity exist for each item
      if (!item.productId || !item.quantity) {
        throw new ApiError(400, "Product ID and quantity are required for each item");
      }

      // Log the individual item for debugging
      console.log("Validating item: ", item);

      // Update stock using ProductService
      await ProductService.updateStock(item.productId, item.quantity);

      // Add the validated item to the order's item list
      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    // Log the items to be added to the order
    console.log("Items to be added to the order: ", itemsToCreate);

    // Create order after stock validation
    const order = await OrdersModel.create({
      consumer: body.consumer,
      items: itemsToCreate,  // Make sure to add the validated items
      orderDate: new Date(),
    });

    return {
      msg: "Order Created Successfully",
      order,
    };
  }



  static async getAllorders(user, page = 1, query) {
    const limit = 10;
    const perPage = (Number(page) - 1) * limit;

    const queryies = {
      user,
      items: {
        $elemMatch: {
          name: { $regex: query, $options: 'i' },
        },
      },
    };

    const data = await OrdersModel.find(queryies)
      .populate("consumer", "name email")
      .sort({ "createdAt": -1 })
      .limit(limit)
      .skip(perPage);

    const documents = await OrdersModel.countDocuments(queryies);
    const hasMore = perPage + limit < documents;

    return {
      data,
      hasMore,
    };
  }


  static async deleteOrder(user, id) {
    const existOrder = await OrdersModel.findOne({ user, _id: id });

    if (!existOrder) {
      throw new ApiError(404, "Order Not Found");
    }

    await OrdersModel.findByIdAndDelete(existOrder._id);

    return {
      msg: "Order Deleted Successfully",
    };
  }

  static async getInvoiceById(user, id) {
    const order = await OrdersModel.findOne({ user, _id: id })
      .select("consumer user items createdAt")
      .populate("consumer", "name email address -_id")
      .populate("user", "name -_id");

    if (!order) {
      throw new ApiError(404, "Order Not Found");
    }

    return order;
  }

  static async getOrdersByDateRange(user, startDate, endDate) {
    const orders = await OrdersModel.find({
      user,
      orderDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate("consumer", "name email");

    return orders;
  }
}

module.exports = OrderService;
