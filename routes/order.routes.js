const express = require("express");

const ordersController = require("../controllers/orders.controller");

const router = express.Router();

router.post('/orders', ordersController.addOrder)

router.get('/orders', ordersController.getOrders)

module.exports = router;
