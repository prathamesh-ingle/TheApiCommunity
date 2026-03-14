import express from "express";

import{
    AdminLogin,
    verifyAdminLogin,
    createEvent,
    updateEvent,
    deleteEvent,
    getAdminDashboard,
    getAllApplicants,
    AdminLogout
} from "../controllers/admin.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import multer from 'multer'; // No dots or slashes here, just the package name
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

//http://localhost:5001/api/admin/login
router.post("/login",AdminLogin);

//http://localhost:5001/api/admin/verify
router.post("/verify",verifyAdminLogin);

//http://localhost:5001/api/admin/add-event
router.post("/add-event", 
    verifyAdmin, 
    upload.fields([
        { name: 'eventImages' }, 
        { name: 'speakerImages' }
    ]), 
    createEvent
);

//http://localhost:5001/api/admin/update-event
router.put("/update-event/:id", 
    upload.fields([{ name: 'eventImages' }, { name: 'speakerImages' }]), 
    updateEvent
);

//http://localhost:5001/api/admin/delete-event
router.delete("/delete-event/:id",verifyAdmin,deleteEvent)

//http://localhost:5001/api/admin/dashboard
router.get("/dashboard", verifyAdmin, getAdminDashboard);

//http://localhost:5001/api/admin/applicants
router.get("/applicants", verifyAdmin,getAllApplicants);

router.post("/logout",AdminLogout);
export default router;