const Product = require("../models/product.model");

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.render('admin/products/all-products', { products: products });
      } catch (error) {
        next(error);
        return;
      }
    }

const getNewProducts = (req, res) => {
  res.render("admin/products/new-products");
};

const createNewProducts = async (req, res, next) => {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
};

module.exports = {
  getProducts,
  getNewProducts,
  createNewProducts,
};
