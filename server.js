import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import auth_helper from "./src/services/auth_helper.js";
import auth from "./src/middleware/auth.js";
import logRouter from "./src/routes/logRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import db from "./src/config/db.js";

dotenv.config();

// Init crypto + DB
auth_helper.writePublicPrivate();
auth_helper.loadKeyToMemory();
db.initDB();

const PORT = 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_KEY));

const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:4000"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: ["auth"],
  })
);

// Routes
app.use("/auth", logRouter);
app.use("/", auth);
app.use("/docs", documentRoutes);

// START HTTP SERVER
app.listen(PORT, () => {
  console.log("Vulnerable DMS running on http://localhost:3000");
});
