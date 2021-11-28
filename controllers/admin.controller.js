const Product = require("../models/product.model");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render("admin/products/all-products", { products: products });
  } catch (error) {
    next(error);
    return;
  }
};

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

const getUpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/products/update-product", { product });
  } catch (error) {
    next(error);
  }
};
const UpdateProduct = async (req, res, next) => {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });
  if (req.file) {
    product.replaceImage(req.file.filename);
  }
  try {
    
    await product.save();
  } catch (error) {
    next(error)
    return;
  }
  res.redirect('/admin/products')
};

const deleteProduct = async (req, res, next) => {
  let product;
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    next(error)
  }
  
  res.json({message: 'Deleted product!'});
}

module.exports = {
  getProducts,
  getNewProducts,
  createNewProducts,
  getUpdateProduct,
  UpdateProduct,
  deleteProduct,
};
