import express from "express";
import { loginAdmin, logoutAdmin, createAdmin, editAdmin } from "../controller/adminController.js";
import authentication from "../middleware/authentication.js";
import Admin from "../models/Admin.js";

const admin = express.Router();

admin.post("/login-admin", loginAdmin);
admin.post("/logout-admin", logoutAdmin);
admin.post("/new-admin", createAdmin);
admin.put("/edit-admin/:id", editAdmin);
admin.get("/access-admin", authentication("admin"), async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if(!admin)
      return res.status(404).json({ message: "Admin not found." });

    res.status(200).json({
      message: "Welcome to System Administrator",
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: "Server error" });
  }
})

export default admin