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
// APPLY FOR JOB
// CANDIDATE ONLY
// POST /api/applications
// ======================================================

const applySchema = z.object({
  jobId: z.string().min(1),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
});

router.post(
  "/",
  authenticate,
  authorize("CANDIDATE"),
  async (req: AuthRequest, res) => {
    try {
      const data = applySchema.parse(req.body);

      // Find candidate profile
      const candidate =
        await prisma.candidateProfile.findUnique({
          where: {
            userId: req.user!.userId,
          },
        });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate profile not found",
        });
      }

      // Find job
      const job = await prisma.job.findUnique({
        where: {
          id: data.jobId,
        },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      // Prevent duplicate application
      const existingApplication =
        await prisma.application.findFirst({
          where: {
            jobId: data.jobId,
            candidateId: candidate.id,
          },
        });

      if (existingApplication) {
        return res.status(409).json({
          success: false,
          message: "You have already applied for this job",
        });
      }

      // Create application
      const application =
        await prisma.application.create({
          data: {
            jobId: data.jobId,
            candidateId: candidate.id,
            resumeUrl: data.resumeUrl,
            coverLetter: data.coverLetter,
          },
        });

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      console.error("Apply job error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid application data",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to submit application",
      });
    }
  }
);

// ======================================================
// CANDIDATE — MY APPLICATIONS
// GET /api/applications/my-applications
// ======================================================

router.get(
  "/my-applications",
  authenticate,
  authorize("CANDIDATE"),
  async (req: AuthRequest, res) => {
    try {
      const candidate =
        await prisma.candidateProfile.findUnique({
          where: {
            userId: req.user!.userId,
          },
        });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate profile not found",
        });
      }

      const applications =
        await prisma.application.findMany({
          where: {
            candidateId: candidate.id,
          },

          orderBy: {
            appliedAt: "desc",
          },

          include: {
            job: {
              include: {
                recruiter: {
                  select: {
                    companyName: true,
                  },
                },
              },
            },
          },
        });

      return res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      console.error(
        "Get candidate applications error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications",
      });
    }
  }
);

// ======================================================
// RECRUITER — ALL APPLICATIONS
// GET /api/applications/recruiter
// ======================================================

router.get(
  "/recruiter",
  authenticate,
  authorize("RECRUITER"),
  async (req: AuthRequest, res) => {
    try {
      // Find recruiter profile
      const recruiter =
        await prisma.recruiterProfile.findUnique({
          where: {
            userId: req.user!.userId,
          },
        });

      if (!recruiter) {
        return res.status(404).json({
          success: false,
          message: "Recruiter profile not found",
        });
      }

      // Get applications for recruiter's jobs
      const applications =
        await prisma.application.findMany({
          where: {
            job: {
              recruiterId: recruiter.id,
            },
          },

          // IMPORTANT:
          // Application does not have createdAt.
          // It has appliedAt instead.
          orderBy: {
            appliedAt: "desc",
          },

          include: {
            job: {
              select: {
                id: true,
                title: true,
                description: true,
                location: true,
                employmentType: true,
                status: true,
                requiredSkills: true,
                minExperience: true,
                maxExperience: true,
                salaryMin: true,
                salaryMax: true,
              },
            },

            candidate: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

      return res.status(200).json({
        success: true,
        applications,
        total: applications.length,
      });
    } catch (error) {
      console.error(
        "Get recruiter applications error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch recruiter applications",
      });
    }
  }
);

// ======================================================
// RECRUITER — APPLICATIONS FOR ONE JOB
// GET /api/applications/job/:jobId
// ======================================================

router.get(
  "/job/:jobId",
  authenticate,
  authorize("RECRUITER"),
  async (req: AuthRequest, res) => {
    try {
      // Find recruiter
      const recruiter =
        await prisma.recruiterProfile.findUnique({
          where: {
            userId: req.user!.userId,
          },
        });

      if (!recruiter) {
        return res.status(404).json({
          success: false,
          message: "Recruiter profile not found",
        });
      }

      // Verify recruiter owns job
      const job = await prisma.job.findFirst({
        where: {
          id: req.params.jobId,
          recruiterId: recruiter.id,
        },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found or unauthorized",
        });
      }

      // Get applications
      const applications =
        await prisma.application.findMany({
          where: {
            jobId: job.id,
          },

          orderBy: {
            appliedAt: "desc",
          },

          include: {
            candidate: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

      return res.status(200).json({
        success: true,
        job,
        applications,
      });
    } catch (error) {
      console.error(
        "Get job applications error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch job applications",
      });
    }
  }
);

// ======================================================
// RECRUITER — UPDATE APPLICATION STATUS
// PATCH /api/applications/:id/status
// ======================================================

const statusSchema = z.object({
  status: z.string().min(1),
});

router.patch(
  "/:id/status",
  authenticate,
  authorize("RECRUITER"),
  async (req: AuthRequest, res) => {
    try {
      const data = statusSchema.parse(req.body);

      // Find recruiter
      const recruiter =
        await prisma.recruiterProfile.findUnique({
          where: {
            userId: req.user!.userId,
          },
        });

      if (!recruiter) {
        return res.status(404).json({
          success: false,
          message: "Recruiter profile not found",
        });
      }

      // Find application
      const application =
        await prisma.application.findUnique({
          where: {
            id: req.params.id,
          },

          include: {
            job: true,
          },
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      // Check recruiter owns the job
      if (
        application.job.recruiterId !==
        recruiter.id
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to update this application",
        });
      }

      // Update application status
      const updatedApplication =
        await prisma.application.update({
          where: {
            id: req.params.id,
          },

          data: {
            status: data.status as any,
          },
        });

      return res.status(200).json({
        success: true,
        message: "Application status updated",
        application: updatedApplication,
      });
    } catch (error) {
      console.error(
        "Update application status error:",
        error
      );

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid application status",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update application status",
      });
    }
  }
);

export default router;