import express from "express";

import {
  login,
  logout,
  me,
  register,
} from "../controllers/user.controller.js";

import { protectRoute } from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protectRoute, me);

export default router;