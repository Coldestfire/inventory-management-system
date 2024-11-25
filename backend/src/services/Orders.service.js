const httpStatus = require("http-status");
const { ConsumerModel, OrdersModel } = require("../models");
const ApiError = require("../utils/ApiError");
const ProductService = require("../services/Product.service");  // Import ProductService
  const mongoose = require('mongoose');

class OrderService {


  static async createOrder(user, body) {
    // Validate required fields
    if (!body.items || body.items.length === 0) {
        throw new ApiError(400, "Items are required");
    }

    if (!body.consumer) {
        throw new ApiError(400, "Consumer is required");
    }

    // Validate logged-in user
    if (!user) {
        throw new ApiError(400, "Logged-in user information is missing");
    }

    // Prepare the `items` array
    const itemsToCreate = await Promise.all(
        body.items.map(async (item) => {
            // Validate productId and quantity
            if (!item.productId || !item.quantity) {
                throw new ApiError(400, "Product ID and quantity are required for each item");
            }

            // Log the item for debugging
            console.log("Validating item:", item);

            // Update stock using ProductService
            await ProductService.updateStock(item.productId, item.quantity);

            // Return the formatted item
            return {
                productId: item.productId,
                quantity: item.quantity,
                status: item.status || "pending", // Default status to "pending"
            };
        })
    );

    // Log the prepared items for debugging
    console.log("Prepared items for order:", itemsToCreate);

    // Create the order object
    const orderData = {
        user: user, // The logged-in user placing the order
        consumer: body.consumer, // Consumer ID
        items: itemsToCreate,
        orderDate: new Date(),
    };

    
    // Log the order payload for debugging
    console.log("Creating order with data:", orderData);

    // Create the order in the database
    const order = await OrdersModel.create(orderData);

    // Return success response with order details
    return {
        msg: "Order Created Successfully",
        order,
    };
}

  


static async getAllorders(user, page = 1, query = "") {
  const limit = 10;
  const skip = (Number(page) - 1) * limit;

  // Ensure the base query is accurate
  const baseQuery = { user: user }; // Filter by logged-in user
  const orders = await OrdersModel.find(baseQuery)
  .populate("consumer", "name email") // Populate consumer's name and email
  .populate("items.productId", "name description price") // Populate product details
  .sort({ orderDate: -1 }) // Sort by order date (newest first)
  .limit(limit)
  .skip(skip);

// DEBUGGING START
orders.forEach(order => {
  console.log("Type of Order.consumer: ", typeof order.consumer); // Should be 'object' and contain name and email
  console.log("Consumer object: ", order.consumer); // Check if consumer is populated correctly

  const orderData = {
    user: order.user, // The logged-in user (can be accessed from each order)
    consumer: order.consumer ? new mongoose.Types.ObjectId(order.consumer._id) : null, // Correct access
    orderDate: new Date(),
  };

  console.log("orderData: ", orderData);
});

  // Filter by product name if a query is provided
  const filteredOrders = query
    ? orders.filter((order) =>
        order.items.some((item) =>
          item.productId.name.toLowerCase().includes(query.toLowerCase())
        )
      )
    : orders;

  // Count total documents for pagination
  const totalOrders = await OrdersModel.countDocuments();
  const hasMore = skip + limit < totalOrders;

      // console.log("Filtered Orders:", filteredOrders);
      // console.log("Total Orders:", totalOrders);
      // console.log("Service orders", orders);

  // Return the paginated and filtered orders
  return {
    data: orders,
    hasMore,
  };
}


static async deleteOrder(user,id) {
  const existOrder = await OrdersModel.findById({ _id: id, user });
  console.log("ID: ", id);
  console.log("EXIST ORDER: ", existOrder);
  if (!existOrder) {
      throw new ApiError(404, "Order Not Found");
  }

  await OrdersModel.findByIdAndDelete({ _id: id, user });

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
