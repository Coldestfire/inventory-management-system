const { body } = require('express-validator');

class OrderValidation {
  static CreateOrder = [
    body('consumer')
      .isMongoId()
      .withMessage('Consumer ID must be a valid MongoDB ID')
      .notEmpty()
      .withMessage('Consumer ID is required'),
    
    body('items')
      .isArray()
      .withMessage('Items must be an array')
      .notEmpty()
      .withMessage('Items are required'),

    body('items.*.productId')
      .isMongoId()
      .withMessage('Product ID must be a valid MongoDB ID'),

    body('items.*.quantity')
      .isInt({ gt: 0 })
      .withMessage('Quantity must be a positive integer')
  ];
}

module.exports = OrderValidation;
