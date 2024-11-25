const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsumerSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  address: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Consumer = mongoose.model('Consumer', ConsumerSchema);

module.exports = Consumer;
