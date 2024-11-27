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

  


static async getAllorders(user, page = 1, query = "", startDate = null, endDate = null) {
  const limit = 5;
  const skip = (Number(page) - 1) * limit;

  console.log({ user, page, query, startDate, endDate });
  console.log({ skip, limit });


  // Build base query
  const baseQuery = { user: user };

  // Add product name query
  if (query) {
    baseQuery["items.productId.name"] = { $regex: query, $options: "i" };
  }

  // Add date range filters
  if (startDate) {
    baseQuery.orderDate = { $gte: new Date(startDate) };
  }
  if (endDate) {
    baseQuery.orderDate = {
      ...baseQuery.orderDate,
      $lte: new Date(endDate),
    };
  }

  const orders = await OrdersModel.find(baseQuery)
    .populate("consumer", "name email")
    .populate("items.productId", "name description price")
    .sort({ orderDate: -1 })
    .limit(limit)
    .skip(skip);

  const totalOrders = await OrdersModel.countDocuments(baseQuery);
  const hasMore = skip + limit < totalOrders;

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

  static async getMostAppeared(user) {
    const pipeline = [
      {
        $match: { user: new mongoose.Types.ObjectId(user) } // Match orders for the specific user
      },
      { $unwind: "$items" }, // Unwind the items array
      {
        $group: {
          _id: "$items.productId", // Group by productId
          count: { $sum: 1 } // Count occurrences of each product
        }
      },
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 1 }, // Limit to the most frequent product
      {
        $lookup: {
          from: "products", // Name of the Product collection
          localField: "_id", // Field in the current pipeline (productId)
          foreignField: "_id", // Field in the Product collection
          as: "productDetails" // Alias for the joined data
        }
      },
      {
        $project: {
          _id: 1, // Include productId
          count: 1, // Include count
          productName: { $arrayElemAt: ["$productDetails.name", 0] } // Extract the product name
        }
      }
    ];
  
    const result = await OrdersModel.aggregate(pipeline);
  
    // Handle result gracefully
    if (result.length === 0) {
      return { productId: null, count: 0, productName: null };
    }
  
    return {
      productId: result[0]._id, // Most appeared product ID
      count: result[0].count,   // Number of appearances
      productName: result[0].productName, // Product name
    };
  }
  
  static async WeeklyRevenue(user) {
    const orders = await OrdersModel.find({ user })
      .populate("items.productId", "price")
      .select("items quantity orderDate");
  
    const today = new Date();
    const past7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    });
  
    const salesByDay = past7Days.reduce((acc, date) => ({ ...acc, [date]: 0 }), {});
  
    orders.forEach((order) => {
      if (!order.orderDate) return;
      const orderDate = new Date(order.orderDate).toLocaleDateString("en-GB");
      if (salesByDay[orderDate] !== undefined) {
        order.items.forEach((item) => {
          if (item.productId?.price) {
            salesByDay[orderDate] += item.productId.price * item.quantity;
          }
        });
      }
    });
  
    return Object.entries(salesByDay).map(([date, revenue]) => ({ date, revenue }));
  }
  
  
  static async updateById(id, body) {
    const { consumer, items } = body;

    console.log("Request ID:", id);
    console.log("Request Body:", body);

    // Check if the order exists
    const order = await OrdersModel.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // You can include validation for individual fields if needed
    if (items && Array.isArray(items)) {
      // Ensure that each item contains a valid productId, quantity, and status
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity < 1) {
          throw new ApiError(400, 'Invalid item in order');
        }

        // Ensure status is valid if provided
        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (item.status && !validStatuses.includes(item.status)) {
          throw new ApiError(400, 'Invalid status in order item');
        }
      }
    }

    // Update the order details
    await OrdersModel.findByIdAndUpdate(id, {
      consumer: consumer || order.consumer,  // If not provided, retain the existing value
      items: items || order.items,  // If not provided, retain the existing value
    });

    return {
      msg: 'Order updated successfully',
    };
  }
  


}

module.exports = OrderService;
