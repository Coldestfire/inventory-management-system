const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const ProductService = require("../services/Product.service");

class ProductController {
    static createProduct = CatchAsync(async (req, res) => {
        const product = await ProductService.createProduct(req.user, req.body);
        return res.status(201).json(product);
    });

    static  getProducts = CatchAsync(async (req, res) => {
        const products = await ProductService.getProducts(req.user, req.query.page, req.query.query);
        return res.status(200).json(products);
    });

    static updateProduct = CatchAsync(async (req, res) => {
        const product = await ProductService.updateProduct(req.user, req.params.id, req.body);
        return res.status(200).json(product);
    });

    static deleteProduct = CatchAsync(async (req, res) => {
        const result = await ProductService.deleteProduct(req.user, req.params.id);
        return res.status(204).json(result);
    });

    static getProductStats = CatchAsync(async (req, res) => {
        const stats = await ProductService.getProductStats(req.user);
        return res.status(200).json(stats);
    });
}

module.exports = ProductController;