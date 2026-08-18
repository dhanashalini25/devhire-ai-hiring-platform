import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/db";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
  companyName: z.string().optional(),
});

// ===============================
// REGISTER
// ===============================

router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,

        ...(data.role === "CANDIDATE"
          ? {
              candidateProfile: {
                create: {
                  skills: [],
                },
              },
            }
          : {
              recruiterProfile: {
                create: {
                  companyName: data.companyName || data.name,
                },
              },
            }),
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration data",
        errors: error.issues,
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {
  try {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid login data",
        errors: error.issues,
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

export default router;