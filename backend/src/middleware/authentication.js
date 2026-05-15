import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
  let token = req.cookies?.token;

  // if(role === "admin") token = req.cookies?.admin_token;
  // else if(role === "client") token = req.cookies?.client_token;
  if(!token)
    return res.status(401).json({ message: "No token, access denied." });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({message: "Invalid token"});
  }
}

export default authentication