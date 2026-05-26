import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../libs/prisma.js";
import { generateToken } from "../utils/generateToken.js";


// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};


// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};


// LOGOUT
export const logout = async (req: Request, res: Response) => {
  try {

    res.cookie("jwt", "", {
      maxAge: 0,
    });

    res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};


// ME
export const me = async (req: Request, res: Response) => {
  try {

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};