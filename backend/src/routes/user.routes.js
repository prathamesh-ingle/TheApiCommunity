// backend/src/routes/user.routes.js
import express from "express";
import { ApplicationControler } from "../controllers/user.controller.js";

const router = express.Router();

router.post(`/application-form`, ApplicationControler);

export default router;
