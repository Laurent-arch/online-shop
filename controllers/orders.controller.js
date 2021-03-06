const Order = require("../models/order.model");
const User = require("../models/user.model");

const getOrders = (req, res) => {
    res.render('customer/orders/all-orders')
}

const addOrder = async (req, res, next) => {
  const cart = res.locals.cart;
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  res.redirect('/orders');
};

module.exports = {
  addOrder,
  getOrders
};
