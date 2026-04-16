import jwt from "jsonwebtoken";

const authentication = (role) => (req, res, next) => {
  let token;

  if(role === "admin") token = req.cookies?.admin_token;
  else if(role === "client") token = req.cookies?.client_token;

  if(!token)
    return res.status(401).json({ message: "No token, access denied." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({message: "Invalid token"});
  }
}

export default authentication