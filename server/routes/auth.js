import express from 'express'
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshAccessToken);

export default router;
