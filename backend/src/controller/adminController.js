import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if(!username?.trim() || !password?.trim()) 
      return res.status(400).json({ message: "All fields are required" });

    const admin = await Admin.findOne({ username });

    if(!admin)
      return res.status(400).json({ message: "Invalid username" });

    const isMatch = await bcrypt.compare(password, admin.password);

    if(!isMatch)
      return res.status(400).json({ message: "Invalid passsword" });

    const DAYS = 30;

    const token = jwt.sign(
      {id: admin._id},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN || `${DAYS}D`}
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: DAYS * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "Admin login successfully.",
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name
      }
     })

  } catch (err) {
    console.log("Error in loginAdmin controller", err);
    res.status(500).json({ message: "Internal server error" });
  } 
}

export const logoutAdmin = async (_, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: true
    })
    res.status(200).json({ message: "Admin logged out." })
  } catch (err) {
    console.log("Error in logoutAdmin controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const createAdmin = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    const usernameExists = await Admin.findOne({ username });

    if(usernameExists)
      return res.status(400).json({ message: "Username already exists, choose a unique one." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = await Admin.create({ username, name, password: hashedPassword });

    res.status(201).json({ 
      message: "Admin created successfully.",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        name: newAdmin.name
      }
     });

  } catch (err) {
    console.log("Error in createAdmin controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const editAdmin = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    if(!username?.trim() || !name?.trim() || !password?.trim())
      return res.status(400).json({ message: "Fields cannot be empty." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.findByIdAndUpdate(
      req.params.id, 
      { $set: { 
        username, name: name, password: hashedPassword
      } }, 
      { afterDocument: true }
    );

    if(!admin)
      return res.status(404).json({ message: "Admin not found." });

    res.status(200).json({ 
      message: "Admin updated successfully.",
      admin
    })

  } catch (err) {
    console.log("Error in editAdmin controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
}