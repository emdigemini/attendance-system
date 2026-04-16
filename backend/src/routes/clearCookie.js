import express from "express";
const router = express.Router();

router.post("/clear-cookie", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",   // must match how it was set
    secure: false       // match dev environment
  });

  res.status(200).json({ message: "Cookie cleared/reset!" });
});

export default router;