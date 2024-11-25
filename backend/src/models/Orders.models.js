const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { // The logged-in user placing the order
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure it refers to the 'User' model
    required: [true, 'User is required'], // Make it mandatory
  },
  consumer: { // The customer or consumer for whom the order is being placed
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consumer', // Ensure it refers to the 'Consumer' model
    required: [true, 'Consumer is required'], // Make it mandatory
  },
  items: [
    {
      productId: { // The product being ordered
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Ensure it refers to the 'Product' model
        required: [true, 'Product ID is required'],
      },
      quantity: { // Quantity of the product
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
      },
      status: { // Optional status for each item
        type: String,
        default: "pending"
      }
    },
  ],
  orderDate: { // Timestamp of the order
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
