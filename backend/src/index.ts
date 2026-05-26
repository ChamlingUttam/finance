import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();


// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());


// ROUTES
app.use("/api/auth", authRoutes);


// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});