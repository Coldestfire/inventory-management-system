const httpStatus = require("http-status");
const { ConsumerModel, OrdersModel } = require("../models");
const ApiError = require("../utils/ApiError");

class ConsumerService {
    static async RegisterConsumer(user, body) {
        const { name, email, mobile, dob, address } = body;

        const checkExist = await ConsumerModel.findOne({ email: email, user: user });

        if (checkExist) {
            throw new ApiError(400, "Consumer Already in Record");
        }

        await ConsumerModel.create({
            name, email, mobile, dob, address, user
        });

        return {
            msg: "Consumer Added :)"
        };
    }

    static async DeleteConsumer(user, id) {
        const checkExist = await ConsumerModel.findOneAndDelete({ _id: id, user: user });

        if (!checkExist) {
            throw new ApiError(400, "Consumer Not Found in Record");
        }

        await OrdersModel.deleteMany({ consumer: id });

        return {
            msg: "Consumer Deleted :)"
        };
    }

    static async getById(user, id) {
        const checkExist = await ConsumerModel.findOne({ _id: id, user: user });

        if (!checkExist) {
            throw new ApiError(400, "Consumer Not Found in Record");
        }

        return {
            user: checkExist
        };
    }

    static async GetAllUser(user, page = 1, query = '') {
        const limit = 5;
        const skip = (Number(page) - 1) * limit;

        const queryies = {
            user,
            $or: [
                { name: new RegExp(query) },
                { email: new RegExp(query) },
                { address: new RegExp(query) },
                { mobile: new RegExp(query) }
            ]
        };

        const data = await ConsumerModel.find(queryies).select("name email mobile")
            .skip(skip)
            .limit(limit);

        const totalConsumer = await ConsumerModel.countDocuments(queryies);

        const hasMore = skip + limit < totalConsumer;

        return {
            users: data,
            more: hasMore
        };
    }

    static async updateById(user, body, id) {
        const { name, email, mobile, dob, address } = body;

        const checkExist = await ConsumerModel.findById({ _id: id });

        if (checkExist.email !== email) {
            const checkExistEmail = await ConsumerModel.findOne({ email: email, user: user });

            if (checkExistEmail) {
                throw new ApiError(400, "Consumer Email Already in Another Record");
            }
        }

        await ConsumerModel.findByIdAndUpdate(id, {
            name, email, mobile, dob, address, user
        });

        return {
            msg: "Consumer Update :)"
        };
    }

    static async GetUserForSearch(user) {
        const data = await ConsumerModel.find({ user }).select("name dob");

        return {
            users: data
        };
    }

    static async DashboardData(user) {
        // Get the count of consumers associated with the user
        const consumers = await ConsumerModel.countDocuments({ user });
        console.log("Consumers: ", consumers);
      
        // Fetch all orders for the user and select the necessary fields (order items and quantities)
        const orders = await OrdersModel.find({ user }).populate('items.productId', 'price').select('items quantity');
        console.log("Orders: ", orders);
      
        // Calculate the total sales by summing up the item prices multiplied by their quantities
        let totalSales = 0;
        orders.forEach((order) => {
          order.items.forEach((item) => {
            if (item.productId && item.productId.price) {
              totalSales += item.productId.price * item.quantity;
            }
          });
        });

        console.log("Total Sales: ", totalSales);
      
        // Return the dashboard data
        return {
          consumers,
          orders: orders.length,
          sell: totalSales // Total sales calculated from item prices and quantities
        };
      }

      
      
      
      
}

module.exports = ConsumerService;
