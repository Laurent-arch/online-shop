const express = require("express");
const adminController = require("../controllers/admin.controller");
const router = express.Router();
const imageUploadMiddleware = require("../middleware/image-upload");

router.get("/admin/products", adminController.getProducts);
router.get("/admin/products/new", adminController.getNewProducts);

router.post("/admin/products", imageUploadMiddleware, adminController.createNewProducts);

router.get("/admin/products/:id", adminController.getUpdateProduct);
router.post( "/admin/products/:id", imageUploadMiddleware, adminController.UpdateProduct);

router.delete('/admin/products/:id', adminController.deleteProduct)

module.exports = router;
