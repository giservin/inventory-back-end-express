import express from "express";
// import controller
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from "../controllers/Products.js"
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/products', verifyUser, getProducts);
router.get('/products/:id', verifyUser, getProductById);
router.post('/products', verifyUser, addProduct);
router.patch('/products/:id', verifyUser, updateProduct);
router.delete('/products/:id', verifyUser, deleteProduct);

export default router;