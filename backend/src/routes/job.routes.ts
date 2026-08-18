import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// ==========================================
// CREATE JOB
// RECRUITER ONLY
// ==========================================

const createJobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(20),
  location: z.string().min(2),
  employmentType: z.string().min(2),
  requiredSkills: z.array(z.string()).min(1),
  minExperience: z.number().int().min(0).optional(),
  maxExperience: z.number().int().min(0).optional(),
});

router.post(
  "/",
  authenticate,
  authorize("RECRUITER"),
  async (req: AuthRequest, res) => {
    try {
      const data = createJobSchema.parse(req.body);

      const recruiterUserId = req.user!.userId;

      const recruiter = await prisma.recruiterProfile.findUnique({
        where: {
          userId: recruiterUserId,
        },
      });

      if (!recruiter) {
        return res.status(404).json({
          success: false,
          message: "Recruiter profile not found",
        });
      }

      const job = await prisma.job.create({
        data: {
          title: data.title,
          description: data.description,
          location: data.location,
          employmentType: data.employmentType,
          requiredSkills: data.requiredSkills,
          minExperience: data.minExperience,
          maxExperience: data.maxExperience,
          recruiterId: recruiter.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Job created successfully",
        job,
      });
    } catch (error) {
      console.error("Create job error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid job data",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create job",
      });
    }
  }
);

// ==========================================
// GET ALL JOBS
// PUBLIC
// ==========================================

router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const location =
      typeof req.query.location === "string"
        ? req.query.location.trim()
        : "";

    // Build filters without assuming a particular JobStatus value.
    const where: any = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          recruiter: {
            select: {
              companyName: true,
            },
          },
        },
      }),

      prisma.job.count({
        where,
      }),
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

// ==========================================
// GET SINGLE JOB
// PUBLIC
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        recruiter: {
          select: {
            companyName: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
});

// ==========================================
// GET RECRUITER'S JOBS
// RECRUITER ONLY
// ==========================================

router.get(
  "/recruiter/my-jobs",
  authenticate,
  authorize("RECRUITER"),
  async (req: AuthRequest, res) => {
    try {
      const recruiter = await prisma.recruiterProfile.findUnique({
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

      const jobs = await prisma.job.findMany({
        where: {
          recruiterId: recruiter.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        jobs,
      });
    } catch (error) {
      console.error("Get recruiter jobs error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch recruiter jobs",
      });
    }
  }
);

export default router;