import { Router } from "express";
import { z } from "zod";

import { prisma } from "../config/db";

import {
  authenticate,
  AuthRequest,
} from "../middleware/auth.middleware";

import { authorize } from "../middleware/role.middleware";

const router = Router();

// ======================================================
// CANDIDATE PROFILE SCHEMA
// ======================================================

const profileSchema = z.object({
  phone: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().optional(),
  resumeText: z.string().optional(),
});

// ======================================================
// CREATE / UPDATE CANDIDATE PROFILE
// ======================================================

router.post(
  "/profile",
  authenticate,
  authorize("CANDIDATE"),
  async (req: AuthRequest, res) => {
    try {
      const data = profileSchema.parse(req.body);

      const userId = req.user!.userId;

      const profile = await prisma.candidateProfile.upsert({
        where: {
          userId: userId,
        },

        update: {
          phone: data.phone,
          location: data.location,
          resumeUrl: data.resumeUrl,
          resumeText: data.resumeText,
        },

        create: {
          userId: userId,
          phone: data.phone,
          location: data.location,
          resumeUrl: data.resumeUrl,
          resumeText: data.resumeText,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Candidate profile saved successfully",
        profile,
      });
    } catch (error) {
      console.error("Candidate profile error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid profile data",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to save candidate profile",
      });
    }
  }
);

// ======================================================
// GET MY PROFILE
// ======================================================

router.get(
  "/profile",
  authenticate,
  authorize("CANDIDATE"),
  async (req: AuthRequest, res) => {
    try {
      const profile =
        await prisma.candidateProfile.findUnique({
          where: {
            userId: req.user!.userId,
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Candidate profile not found",
        });
      }

      return res.status(200).json({
        success: true,
        profile,
      });
    } catch (error) {
      console.error(
        "Get candidate profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch candidate profile",
      });
    }
  }
);

// ======================================================
// DELETE MY PROFILE
// ======================================================

router.delete(
  "/profile",
  authenticate,
  authorize("CANDIDATE"),
  async (req: AuthRequest, res) => {
    try {
      const profile =
        await prisma.candidateProfile.findUnique({
          where: {
            userId: req.user!.userId,
          },
        });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Candidate profile not found",
        });
      }

      await prisma.candidateProfile.delete({
        where: {
          userId: req.user!.userId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Candidate profile deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete candidate profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to delete candidate profile",
      });
    }
  }
);

export default router;