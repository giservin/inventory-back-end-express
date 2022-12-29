import express from "express";
// import controller
import {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
} from "../controllers/Users.js"
// sebelum akses ini harus login dulu
import { verifyUser,adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// maka gunakan verifyUser sbg middleware di setiap route
router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id',verifyUser,adminOnly, getUserById);
router.post('/users',verifyUser,adminOnly, addUser);
router.patch('/users/:id',verifyUser,adminOnly, updateUser);
router.delete('/users/:id',verifyUser,adminOnly, deleteUser);
// disini telah dilindungi endpoint User dengan Middleware
export default router;