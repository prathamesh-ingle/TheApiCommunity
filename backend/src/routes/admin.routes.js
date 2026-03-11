import express from "express";

import{
    AdminLogin,
    verifyAdminLogin
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login",AdminLogin);
router.post("/verify",verifyAdminLogin);

export default router;