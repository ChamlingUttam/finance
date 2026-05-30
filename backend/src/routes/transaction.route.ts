import express from "express";
import { protectRoute } from "../middlewares/user.middleware.js";
import { createTransaction, getCategoryTransaction, getTransaction } from "../controllers/transaction.controller.js";

const transactionRouter = express.Router()

transactionRouter.use(protectRoute)

transactionRouter.post("/create",createTransaction)
transactionRouter.get("/get",getTransaction)
transactionRouter.get("/getSingle",getCategoryTransaction)


export default transactionRouter