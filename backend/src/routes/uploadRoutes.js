import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../middleware/cloudinary.js"
import Account from "../models/accounts/Account.js";
import authentication from "../middleware/authentication.js";

const router = express.Router();

router.post("/upload-pfp", authentication("client"), upload.single("pfp"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64Image = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "pfp",
    });

    console.log(result);

    const user = await Account.findByIdAndUpdate(
      req.user.id,
      { pfp: result.secure_url },
      { afterDocument: true }
    );

    res.json({
      message: "Uploaded successfully",
      // imageUrl: result.secure_url,
      // user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router
