import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import auth_helper from "./src/services/auth_helper.js";
import auth from "./src/middleware/auth.js";
import logRouter from "./src/routes/logRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import db from "./src/config/db.js";

dotenv.config();

auth_helper.writePublicPrivate();
auth_helper.loadKeyToMemory();
db.initDB();

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.SECRET_KEY));

app.use("/auth", logRouter);

app.use("/",auth);

app.use("/docs", documentRoutes);

app.listen(PORT, () => {
  console.log("Vulnerable DMS running on http://localhost:3000");
});
