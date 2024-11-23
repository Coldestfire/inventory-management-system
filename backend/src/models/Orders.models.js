// Order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  consumer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consumer', // Assuming the Consumer model exists and is linked
    // required: [true, 'Consumer is required'], // Ensure it's marked as required
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Ensure the Product model is linked properly
        // required: [true, 'Product ID is required'],
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        // min: [1, 'Quantity must be at least 1'],
      },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
