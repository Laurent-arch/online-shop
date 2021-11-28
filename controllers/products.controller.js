const Product = require("../models/product.model");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render("customer/products/all-products", { products });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("customer/products/product-details", { product });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProduct,
};
