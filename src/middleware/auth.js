import express from "express";
import auth_helper from "../services/auth_helper.js";

const auth = express.Router();

auth.use(async (req, res, next) => {
  try {

    const authHeader = req.headers["auth"];


    const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1]: null;

    const tokenFromCookie = req.cookies?.chatAuth;

    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      console.log("no token Provided");
      return res.status(401).json({ status: false, message: "No token provided" });
    }
   

    const decode = await auth_helper.verifyToken(token);

    if(decode){

      req.user=decode.id;

      next();

    } else{
      console.log("The token was invalid");
      return res.status(401).json({status:false,message:"Invalid token"});
    };

  } catch (error) {

    console.error("Auth middleware error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
    
  }

});

export default auth;