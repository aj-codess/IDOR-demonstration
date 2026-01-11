import express from "express";
import logController from "./../controller/logController.js";

const logRouter = express.Router();

/* LOGIN  AND SIGNUP */
logRouter.post("/login", (req, res) => {
    logController.login_or_signup(req,res);
});

/* LOGOUT */
logRouter.get("/logout", (req, res) => {
    logController.logout(req,res);
});





export default logRouter;