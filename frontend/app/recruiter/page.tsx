"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000";

type Job = {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  employmentType?: string | null;
  requiredSkills: string[];
  minExperience?: number | null;
  maxExperience?: number | null;
  status?: string;
  createdAt: string;
};

type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills?: string[];
  experience?: number;
  resumeUrl?: string;
};

type Application = {
  id: string;
  status: string;
  coverLetter?: string;
  appliedAt: string;
  candidate?: Candidate;
  job?: {
    id: string;
    title: string;
  };
};

type RecruiterUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function RecruiterDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<RecruiterUser | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [loading, setLoading] = useState(true);
  const [creatingJob, setCreatingJob] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "jobs" | "create" | "applications"
  >("dashboard");

  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [skills, setSkills] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const token = localStorage.getItem("devhire_token");
    const savedUser = localStorage.getItem("devhire_user");

    if (!token || !savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "RECRUITER") {
        router.push("/candidate");
        return;
      }

      setUser(parsedUser);
      loadDashboard(token);
    } catch {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  async function loadDashboard(token: string) {
    setLoading(true);
    setError("");

    try {
      const jobsResponse = await fetch(
        `${API_URL}/api/jobs/recruiter/my-jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jobsData = await jobsResponse.json();

      if (!jobsResponse.ok || !jobsData.success) {
        throw new Error(
          jobsData.message || "Unable to load recruiter jobs"
        );
      }

      setJobs(jobsData.jobs || []);

      /*
       * Applications endpoint.
       *
       * If your backend has this endpoint, applications will load.
       * If it doesn't exist yet, the dashboard will still work for jobs.
       */
      try {
        const applicationsResponse = await fetch(
          `${API_URL}/api/applications/recruiter`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (applicationsResponse.ok) {
          const applicationsData =
            await applicationsResponse.json();

          if (applicationsData.success) {
            setApplications(applicationsData.applications || []);
          }
        }
      } catch {
        console.log("Applications endpoint not available yet.");
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateJob(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCreatingJob(true);
    setMessage("");
    setError("");

    const token = localStorage.getItem("devhire_token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const requiredSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (requiredSkills.length === 0) {
        throw new Error("Please enter at least one required skill.");
      }

      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: jobTitle,
          description,
          location,
          employmentType,
          requiredSkills,
          minExperience:
            minExperience === ""
              ? undefined
              : Number(minExperience),
          maxExperience:
            maxExperience === ""
              ? undefined
              : Number(maxExperience),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create job"
        );
      }

      setMessage("Job created successfully!");

      setJobTitle("");
      setDescription("");
      setLocation("");
      setEmploymentType("Full-time");
      setSkills("");
      setMinExperience("");
      setMaxExperience("");

      await loadDashboard(token);

      setActiveTab("jobs");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create job"
      );
    } finally {
      setCreatingJob(false);
    }
  }

  async function updateApplicationStatus(
    applicationId: string
  ) {
    const token = localStorage.getItem("devhire_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const status = selectedStatus[applicationId];

    if (!status) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update application"
        );
      }

      setMessage("Candidate status updated successfully.");

      await loadDashboard(token);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update candidate status"
      );
    }
  }

  async function closeJob(jobId: string) {
    const token = localStorage.getItem("devhire_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to close this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/jobs/${jobId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "CLOSED",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to close job"
        );
      }

      setMessage("Job closed successfully.");

      await loadDashboard(token);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to close job"
      );
    }
  }

  function logout() {
    localStorage.removeItem("devhire_token");
    localStorage.removeItem("devhire_user");
    localStorage.removeItem("devhire_role");

    router.push("/login");
  }

  const publishedJobs = useMemo(
    () =>
      jobs.filter(
        (job) => job.status === "PUBLISHED"
      ).length,
    [jobs]
  );

  const closedJobs = useMemo(
    () =>
      jobs.filter(
        (job) => job.status === "CLOSED"
      ).length,
    [jobs]
  );

  const shortlisted = useMemo(
    () =>
      applications.filter(
        (application) =>
          application.status === "SHORTLISTED"
      ).length,
    [applications]
  );

  const interviews = useMemo(
    () =>
      applications.filter(
        (application) =>
          application.status === "INTERVIEW"
      ).length,
    [applications]
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          <p className="text-gray-400">
            Loading recruiter dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold">
              Dev<span className="text-cyan-400">Hire</span>
            </h1>

            <p className="text-sm text-gray-500">
              Recruiter Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                {user?.name || "Recruiter"}
              </p>

              <p className="text-xs text-gray-500">
                {user?.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-gray-300 transition hover:border-red-400 hover:text-red-400"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* NAVIGATION */}
        <div className="mb-8 flex flex-wrap gap-2">

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              activeTab === "dashboard"
                ? "bg-cyan-500 text-white"
                : "bg-slate-900 text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              activeTab === "jobs"
                ? "bg-cyan-500 text-white"
                : "bg-slate-900 text-gray-400 hover:text-white"
            }`}
          >
            My Jobs
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              activeTab === "create"
                ? "bg-cyan-500 text-white"
                : "bg-slate-900 text-gray-400 hover:text-white"
            }`}
          >
            + Create Job
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              activeTab === "applications"
                ? "bg-cyan-500 text-white"
                : "bg-slate-900 text-gray-400 hover:text-white"
            }`}
          >
            Applications
          </button>

        </div>

        {/* MESSAGES */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* =====================================================
            STEP 4 — DASHBOARD STATISTICS
        ===================================================== */}

        {activeTab === "dashboard" && (
          <section>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                Welcome, {user?.name || "Recruiter"}
              </h2>

              <p className="mt-2 text-gray-400">
                Manage your jobs and candidates from one place.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                title="Total Jobs"
                value={jobs.length}
                icon="💼"
              />

              <StatCard
                title="Published Jobs"
                value={publishedJobs}
                icon="🚀"
              />

              <StatCard
                title="Applications"
                value={applications.length}
                icon="📄"
              />

              <StatCard
                title="Interviews"
                value={interviews}
                icon="🎯"
              />

            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">

              <StatCard
                title="Shortlisted Candidates"
                value={shortlisted}
                icon="⭐"
              />

              <StatCard
                title="Closed Jobs"
                value={closedJobs}
                icon="🔒"
              />

            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h3 className="text-xl font-bold">
                Quick Actions
              </h3>

              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  onClick={() => setActiveTab("create")}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold hover:bg-cyan-400"
                >
                  + Create Job
                </button>

                <button
                  onClick={() => setActiveTab("jobs")}
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400"
                >
                  Manage Jobs
                </button>

                <button
                  onClick={() =>
                    setActiveTab("applications")
                  }
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400"
                >
                  View Candidates
                </button>

              </div>

            </div>

          </section>
        )}

        {/* =====================================================
            STEP 1 — CREATE / MANAGE JOBS
        ===================================================== */}

        {activeTab === "create" && (
          <section>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                Create New Job
              </h2>

              <p className="mt-2 text-gray-400">
                Publish a new opportunity for candidates.
              </p>
            </div>

            <form
              onSubmit={handleCreateJob}
              className="max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >

              <div className="grid gap-5">

                <Input
                  label="Job Title"
                  value={jobTitle}
                  onChange={setJobTitle}
                  placeholder="Software Engineer"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Job Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Describe the job responsibilities and requirements..."
                    required
                    rows={6}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <Input
                  label="Location"
                  value={location}
                  onChange={setLocation}
                  placeholder="Chennai / Bengaluru / Remote"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Employment Type
                  </label>

                  <select
                    value={employmentType}
                    onChange={(e) =>
                      setEmploymentType(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>

                <Input
                  label="Required Skills"
                  value={skills}
                  onChange={setSkills}
                  placeholder="Java, React, Node.js, SQL"
                />

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Minimum Experience"
                    value={minExperience}
                    onChange={setMinExperience}
                    placeholder="0"
                    type="number"
                  />

                  <Input
                    label="Maximum Experience"
                    value={maxExperience}
                    onChange={setMaxExperience}
                    placeholder="3"
                    type="number"
                  />

                </div>

                <button
                  type="submit"
                  disabled={creatingJob}
                  className="rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold hover:bg-cyan-400 disabled:opacity-50"
                >
                  {creatingJob
                    ? "Creating Job..."
                    : "Create Job"}
                </button>

              </div>

            </form>

          </section>
        )}

        {activeTab === "jobs" && (
          <section>

            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-3xl font-bold">
                  My Jobs
                </h2>

                <p className="mt-2 text-gray-400">
                  Create and manage your job postings.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("create")}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold hover:bg-cyan-400"
              >
                + Create Job
              </button>

            </div>

            {jobs.length === 0 ? (
              <EmptyState
                title="No jobs yet"
                description="Create your first job posting."
                buttonText="Create Job"
                onClick={() => setActiveTab("create")}
              />
            ) : (
              <div className="grid gap-5">

                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >

                    <div className="flex flex-col justify-between gap-4 md:flex-row">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-xl font-bold">
                            {job.title}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              job.status === "CLOSED"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-green-500/10 text-green-400"
                            }`}
                          >
                            {job.status || "DRAFT"}
                          </span>

                        </div>

                        <p className="mt-3 text-gray-400">
                          {job.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-400">

                          {job.location && (
                            <span className="rounded-lg bg-slate-950 px-3 py-2">
                              📍 {job.location}
                            </span>
                          )}

                          {job.employmentType && (
                            <span className="rounded-lg bg-slate-950 px-3 py-2">
                              💼 {job.employmentType}
                            </span>
                          )}

                          <span className="rounded-lg bg-slate-950 px-3 py-2">
                            🛠{" "}
                            {job.requiredSkills.join(", ")}
                          </span>

                        </div>

                      </div>

                      <div className="flex items-start gap-2">

                        {job.status !== "CLOSED" && (
                          <button
                            onClick={() =>
                              closeJob(job.id)
                            }
                            className="rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                          >
                            Close Job
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

        {/* =====================================================
            STEP 2 + STEP 3 — APPLICATIONS / CANDIDATES
        ===================================================== */}

        {activeTab === "applications" && (
          <section>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                Applications & Candidates
              </h2>

              <p className="mt-2 text-gray-400">
                Review candidates and update their application status.
              </p>
            </div>

            {applications.length === 0 ? (
              <EmptyState
                title="No applications yet"
                description="Candidate applications will appear here."
              />
            ) : (
              <div className="grid gap-5">

                {applications.map((application) => {

                  const candidate =
                    application.candidate;

                  const currentStatus =
                    selectedStatus[application.id] ||
                    application.status;

                  return (
                    <div
                      key={application.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                    >

                      <div className="flex flex-col justify-between gap-6 lg:flex-row">

                        <div className="flex-1">

                          <h3 className="text-xl font-bold">
                            {candidate?.name ||
                              "Candidate"}
                          </h3>

                          <p className="mt-1 text-gray-400">
                            {candidate?.email}
                          </p>

                          {candidate?.phone && (
                            <p className="mt-1 text-sm text-gray-500">
                              📞 {candidate.phone}
                            </p>
                          )}

                          {candidate?.location && (
                            <p className="mt-1 text-sm text-gray-500">
                              📍 {candidate.location}
                            </p>
                          )}

                          {candidate?.skills &&
                            candidate.skills.length >
                              0 && (
                              <div className="mt-4 flex flex-wrap gap-2">

                                {candidate.skills.map(
                                  (skill) => (
                                    <span
                                      key={skill}
                                      className="rounded-lg bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}

                              </div>
                            )}

                          {application.job && (
                            <p className="mt-4 text-sm text-gray-400">
                              Applied for:{" "}
                              <span className="font-semibold text-white">
                                {application.job.title}
                              </span>
                            </p>
                          )}

                          {application.coverLetter && (
                            <div className="mt-4 rounded-xl bg-slate-950 p-4">

                              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                                Cover Letter
                              </p>

                              <p className="text-sm leading-relaxed text-gray-400">
                                {application.coverLetter}
                              </p>

                            </div>
                          )}

                        </div>

                        <div className="w-full lg:w-64">

                          <p className="mb-2 text-sm font-semibold text-gray-300">
                            Application Status
                          </p>

                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              setSelectedStatus({
                                ...selectedStatus,
                                [application.id]:
                                  e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                          >
                            <option value="APPLIED">
                              Applied
                            </option>

                            <option value="REVIEWING">
                              Reviewing
                            </option>

                            <option value="SHORTLISTED">
                              Shortlisted
                            </option>

                            <option value="INTERVIEW">
                              Interview
                            </option>

                            <option value="REJECTED">
                              Rejected
                            </option>

                            <option value="HIRED">
                              Hired
                            </option>

                          </select>

                          <button
                            onClick={() =>
                              updateApplicationStatus(
                                application.id
                              )
                            }
                            className="mt-3 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold hover:bg-cyan-400"
                          >
                            Update Status
                          </button>

                          {candidate?.resumeUrl && (
                            <a
                              href={candidate.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 block w-full rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-semibold hover:border-cyan-400"
                            >
                              View Resume
                            </a>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </section>
        )}

      </div>

    </main>
  );
}

/* ============================================================
   REUSABLE COMPONENTS
============================================================ */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={label !== "Minimum Experience" &&
          label !== "Maximum Experience"}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
      />

    </div>
  );
}

function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}: {
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">

      <div className="text-4xl">📭</div>

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 text-gray-500">
        {description}
      </p>

      {buttonText && onClick && (
        <button
          onClick={onClick}
          className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold hover:bg-cyan-400"
        >
          {buttonText}
        </button>
      )}

    </div>
  );
}