import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
}

export const protectRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};