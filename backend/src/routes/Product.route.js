const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/Product.controller');
const Authentication = require("../middlewares/Authentication"); // Assuming this is the correct path
// Uncomment and import validation if you have validation middleware
// const ProductValidation = require('../validations/Product.validation');
// const Validation = require('../middlewares/Validation');

// Apply authentication middleware globally to all routes
router.use(Authentication);

// Route to fetch all products (with optional search and pagination if implemented)
router.get('/', ProductController.getProducts);

// Route to fetch product statistics
router.get('/stats', ProductController.getProductStats);

// Route to create a new product with validation (if available)
// Uncomment validation middleware if you have it
// router.post('/', ProductValidation.createProduct, Validation, ProductController.createProduct);
router.post('/', ProductController.createProduct); // Add validation if available

// Route to update an existing product
// Uncomment validation middleware if you have it
// router.put('/:id', ProductValidation.updateProduct, Validation, ProductController.updateProduct);
router.patch('/:id', ProductController.updateProduct); // Add validation if available

router.get('/:id', ProductController.getProductById);

// Route to delete a product
// Uncomment validation middleware if you have it
// router.delete('/:id', ProductValidation.deleteProduct, Validation, ProductController.deleteProduct);
router.delete('/:id', ProductController.deleteProduct); // Add validation if available

module.exports = router;
