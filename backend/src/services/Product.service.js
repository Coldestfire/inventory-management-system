const { ProductModel } = require('../models')
const ApiError = require("../utils/ApiError");

class ProductService {

      /**
     * Get products with pagination and optional search query.
     *
     * @param {string} user - The ID of the user to filter products by.
     * @param {number} page - The page number for pagination (default: 1).
     * @param {string} query - The search query to filter products by name (default: "").
     * @returns {Promise<Object>} - Returns paginated product data.
     */


    static async createProduct(user, body) {
        const product = await ProductModel.create({
            ...body,
            user,
        });
        return product;
    }

    static async getProducts(user, page = 1, query = "") {
        // Validate inputs
        if (!user) {
            throw new Error("User is required to fetch products.");
        }

        const validatedPage = Math.max(1, page); // Ensure page is at least 1
        const limit = 10; // Number of products per page
        const skip = (validatedPage - 1) * limit;

        // Construct filter
        const filter = {
            user, // User-specific products
            ...(query ? { name: { $regex: query, $options: "i" } } : {}), // Optional search query
        };

        try {
            // Fetch products with pagination
            const products = await ProductModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            // Get total product count for the given filter
            const totalCount = await ProductModel.countDocuments(filter);

            // Construct the response
            const response = {
                data: products,
                total: totalCount,
                hasMore: skip + products.length < totalCount,
            };

            // Logging (optional, remove in production)
            console.log("Filter:", filter);
            console.log("Pagination:", { skip, limit });
            console.log("Response:", response);

            return response;
        } catch (error) {
            // Log and rethrow errors
            console.error("Database error in getProducts:", error);
            throw new Error("Failed to fetch products. Please try again.");
        }
    }
    static async updateStock(productId, quantity) {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        if (product.stock < quantity) {
            throw new ApiError(400, "Insufficient stock");
        }

        product.stock -= quantity;
        await product.save();

        // Check for low stock notification
        if (product.stock <= product.lowStockThreshold) {
            console.log(`Low stock alert for ${product.name}`); 
        }

        return product;
    }


  static async deleteProduct(user, productId) {
    const product = await ProductModel.findOneAndDelete({ _id: productId, user });
    if (!product) {
      throw new ApiError(404, "Product not found or you do not have permission to delete this product.");
    }
    return { msg: "Product deleted successfully" };
  }

    static async getProductStats(user)  {
        const totalProducts = await ProductModel.countDocuments({ user });
        const lowStockProducts = await ProductModel.countDocuments({
            user,
            stock: { $lte: "$lowStockThreshold" },
        });

        return {
            totalProducts,
            lowStockProducts,
        };
    }

    // ProductService.js
static async updateById(id, body) {
    const { name, price, stock, lowStockThreshold, description } = body;

    console.log("Request ID:", id);
    console.log("Request Body:", body);


    // Check if the product exists
    const product = await ProductModel.findById(id);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    // Update the product
    await ProductModel.findByIdAndUpdate(id, { name, price, stock, lowStockThreshold, description });

    return {
        msg: 'Product updated successfully',
    };
}

static async getById(user, id) {
    // Find the product by its ID and check if it belongs to the given user
    const product = await ProductModel.findOne({ _id: id, user: user });

    // If product doesn't exist, throw an error
    if (!product) {
        throw new ApiError(400, "Product Not Found in Record");
    }

    return {
        product,  // Return the product details
    };
}



}

module.exports = ProductService;
