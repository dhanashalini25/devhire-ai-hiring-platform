"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = " process.env.NEXT_PUBLIC_API_URL;";

type Job = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location?: string | null;
  employmentType?: string | null;
  minExperience?: number | null;
  maxExperience?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  status?: string;
  createdAt?: string;
  recruiter?: {
    companyName?: string;
  };
};

type Application = {
  id: string;
  status: string;
  coverLetter?: string | null;
  appliedAt?: string;
  updatedAt?: string;
  job?: Job;
};

export default function CandidatePage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "jobs" | "applications"
  >("jobs");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // GET TOKEN
  // =========================================================

  function getToken() {
    if (typeof window === "undefined") {
      return "";
    }

    return localStorage.getItem("devhire_token") || "";
  }

  // =========================================================
  // LOAD JOBS
  // =========================================================

  async function loadJobs() {
    try {
      setLoadingJobs(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (location.trim()) {
        params.set("location", location.trim());
      }

      params.set("limit", "50");

      const response = await fetch(
        `${API_URL}/api/jobs?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load jobs"
        );
      }

      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (err) {
      console.error("Jobs error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load jobs"
      );
    } finally {
      setLoadingJobs(false);
    }
  }

  // =========================================================
  // LOAD APPLICATIONS
  // =========================================================

  async function loadApplications() {
    const token = getToken();

    if (!token) {
      setLoadingApplications(false);
      return;
    }

    try {
      setLoadingApplications(true);

      /*
        This is the candidate applications endpoint.
      */

      const response = await fetch(
        `${API_URL}/api/applications/my-applications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load applications"
        );
      }

      setApplications(
        Array.isArray(data.applications)
          ? data.applications
          : []
      );
    } catch (err) {
      console.error("Applications error:", err);

      /*
        Don't destroy the whole dashboard if the
        applications endpoint is unavailable.
      */

      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    await loadJobs();
  }

  // =========================================================
  // OPEN JOB DETAILS
  // =========================================================

  async function openJob(job: Job) {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/jobs/${job.id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load job details"
        );
      }

      setSelectedJob(data.job);
      setCoverLetter("");
    } catch (err) {
      console.error("Job details error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load job details"
      );
    }
  }

  // =========================================================
  // CHECK WHETHER ALREADY APPLIED
  // =========================================================

  function alreadyApplied(jobId: string) {
    return applications.some(
      (application) =>
        application.job?.id === jobId
    );
  }

  // =========================================================
  // APPLY FOR JOB
  // =========================================================

  async function applyForJob() {
    if (!selectedJob) {
      return;
    }

    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    if (alreadyApplied(selectedJob.id)) {
      setError("You have already applied for this job.");
      return;
    }

    try {
      setApplying(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId: selectedJob.id,
            coverLetter:
              coverLetter.trim() || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to apply for job"
        );
      }

      setSuccess("Application submitted successfully!");

      setCoverLetter("");

      await loadApplications();

      setTimeout(() => {
        setSelectedJob(null);
        setSuccess("");
      }, 1200);
    } catch (err) {
      console.error("Apply error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to apply for job"
      );
    } finally {
      setApplying(false);
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {
    localStorage.removeItem("devhire_token");
    localStorage.removeItem("devhire_user");
    localStorage.removeItem("devhire_role");

    router.push("/login");
  }

  // =========================================================
  // LOCAL FILTER
  // =========================================================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text =
        `${job.title} ${job.description} ${
          job.recruiter?.companyName || ""
        } ${job.requiredSkills?.join(" ") || ""}`.toLowerCase();

      const searchMatch =
        !search.trim() ||
        text.includes(search.toLowerCase());

      const locationMatch =
        !location.trim() ||
        (job.location || "")
          .toLowerCase()
          .includes(location.toLowerCase());

      return searchMatch && locationMatch;
    });
  }, [jobs, search, location]);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  function getStatusClass(status: string) {
    switch (status) {
      case "APPLIED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";

      case "REVIEWING":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";

      case "SHORTLISTED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";

      case "INTERVIEW":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

      case "HIRED":
        return "bg-green-500/10 text-green-400 border-green-500/30";

      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/30";

      default:
        return "bg-slate-700 text-gray-300 border-slate-600";
    }
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <div>
            <h1 className="text-2xl font-bold">
              Dev<span className="text-cyan-400">
                Hire
              </span>
            </h1>

            <p className="text-xs text-gray-500">
              Candidate Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => setActiveTab("jobs")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                activeTab === "jobs"
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Find Jobs
            </button>

            <button
              onClick={() => setActiveTab("applications")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                activeTab === "applications"
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              My Applications
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-gray-300 hover:border-red-400 hover:text-red-400"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            {success}
          </div>
        )}

        {/* ===================================================
            JOBS
        =================================================== */}

        {activeTab === "jobs" && (

          <section>

            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                JOB SEARCH
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                Find Your Next Opportunity
              </h2>

              <p className="mt-3 text-gray-400">
                Search jobs and apply directly through DevHire.
              </p>

            </div>

            {/* SEARCH */}

            <form
              onSubmit={handleSearch}
              className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >

              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search job title, skills..."
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

                <input
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Location"
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-7 py-3 font-semibold hover:bg-cyan-400"
                >
                  Search
                </button>

              </div>

            </form>

            {/* JOB COUNT */}

            <div className="mb-5 flex items-center justify-between">

              <h3 className="text-xl font-bold">
                Available Jobs
              </h3>

              <span className="text-sm text-gray-500">
                {filteredJobs.length} jobs found
              </span>

            </div>

            {/* LOADING */}

            {loadingJobs && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-gray-400">
                Loading jobs...
              </div>
            )}

            {/* NO JOBS */}

            {!loadingJobs &&
              filteredJobs.length === 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

                  <div className="text-4xl">
                    🔍
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    No jobs found
                  </h3>

                  <p className="mt-2 text-gray-400">
                    Try another job title or location.
                  </p>

                </div>
              )}

            {/* JOB CARDS */}

            <div className="grid gap-6 md:grid-cols-2">

              {filteredJobs.map((job) => (

                <div
                  key={job.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500/50"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-bold">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-cyan-400">
                        {job.recruiter?.companyName ||
                          "Company"}
                      </p>

                    </div>

                    {job.employmentType && (
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-gray-400">
                        {job.employmentType}
                      </span>
                    )}

                  </div>

                  <div className="mt-5 space-y-2 text-sm text-gray-400">

                    {job.location && (
                      <p>
                        📍 {job.location}
                      </p>
                    )}

                    {job.minExperience !== null &&
                      job.minExperience !== undefined && (
                        <p>
                          💼 {job.minExperience}
                          {job.maxExperience !== null &&
                          job.maxExperience !== undefined
                            ? `-${job.maxExperience}`
                            : "+"}{" "}
                          years experience
                        </p>
                      )}

                    {(job.salaryMin ||
                      job.salaryMax) && (
                      <p>
                        💰{" "}
                        {job.salaryMin
                          ? `₹${job.salaryMin}`
                          : ""}
                        {job.salaryMax
                          ? ` - ₹${job.salaryMax}`
                          : ""}
                      </p>
                    )}

                  </div>

                  {/* SKILLS */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    {job.requiredSkills
                      ?.slice(0, 6)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
                        >
                          {skill}
                        </span>
                      ))}

                  </div>

                  {/* DESCRIPTION */}

                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400">
                    {job.description}
                  </p>

                  {/* BUTTONS */}

                  <div className="mt-6 flex gap-3">

                    <button
                      onClick={() => openJob(job)}
                      className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold hover:border-cyan-400 hover:text-cyan-400"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => openJob(job)}
                      className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold hover:bg-cyan-400"
                    >
                      {alreadyApplied(job.id)
                        ? "Applied"
                        : "Apply Now"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

        {/* ===================================================
            APPLICATIONS
        =================================================== */}

        {activeTab === "applications" && (

          <section>

            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                APPLICATIONS
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                My Applications
              </h2>

              <p className="mt-3 text-gray-400">
                Track the status of every job you applied for.
              </p>

            </div>

            {loadingApplications && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-gray-400">
                Loading applications...
              </div>
            )}

            {!loadingApplications &&
              applications.length === 0 && (

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

                  <div className="text-4xl">
                    📄
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    No applications yet
                  </h3>

                  <p className="mt-2 text-gray-400">
                    Find a job and submit your first application.
                  </p>

                  <button
                    onClick={() => setActiveTab("jobs")}
                    className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-400"
                  >
                    Browse Jobs
                  </button>

                </div>

              )}

            <div className="space-y-5">

              {applications.map((application) => (

                <div
                  key={application.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div>

                      <h3 className="text-xl font-bold">
                        {application.job?.title ||
                          "Job Application"}
                      </h3>

                      <p className="mt-1 text-cyan-400">
                        {application.job?.recruiter
                          ?.companyName ||
                          "Company"}
                      </p>

                      {application.job?.location && (
                        <p className="mt-2 text-sm text-gray-500">
                          📍 {application.job.location}
                        </p>
                      )}

                    </div>

                    <div className="text-left md:text-right">

                      <span
                        className={`inline-block rounded-full border px-4 py-2 text-xs font-semibold ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                      {application.appliedAt && (
                        <p className="mt-2 text-xs text-gray-500">
                          Applied{" "}
                          {new Date(
                            application.appliedAt
                          ).toLocaleDateString()}
                        </p>
                      )}

                    </div>

                  </div>

                  {application.coverLetter && (
                    <div className="mt-5 rounded-xl bg-slate-950 p-4">

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Cover Letter
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {application.coverLetter}
                      </p>

                    </div>
                  )}

                </div>

              ))}

            </div>

          </section>

        )}

      </div>

      {/* =====================================================
          JOB DETAILS MODAL
      ===================================================== */}

      {selectedJob && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900">

            {/* MODAL HEADER */}

            <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-6">

              <div>

                <p className="text-sm text-cyan-400">
                  Job Details
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {selectedJob.title}
                </h2>

              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="rounded-lg px-3 py-2 text-gray-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-7 p-6">

              {/* COMPANY */}

              <div>

                <h3 className="text-lg font-bold">
                  {selectedJob.recruiter?.companyName ||
                    "Company"}
                </h3>

                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-400">

                  {selectedJob.location && (
                    <span>
                      📍 {selectedJob.location}
                    </span>
                  )}

                  {selectedJob.employmentType && (
                    <span>
                      💼 {selectedJob.employmentType}
                    </span>
                  )}

                  {selectedJob.minExperience !==
                    null &&
                    selectedJob.minExperience !==
                      undefined && (
                      <span>
                        Experience:{" "}
                        {selectedJob.minExperience}
                        {selectedJob.maxExperience !==
                          null &&
                        selectedJob.maxExperience !==
                          undefined
                          ? `-${selectedJob.maxExperience}`
                          : "+"}{" "}
                        years
                      </span>
                    )}

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <h3 className="text-lg font-bold">
                  Job Description
                </h3>

                <p className="mt-3 whitespace-pre-line leading-7 text-gray-400">
                  {selectedJob.description}
                </p>

              </div>

              {/* SKILLS */}

              <div>

                <h3 className="text-lg font-bold">
                  Required Skills
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">

                  {selectedJob.requiredSkills?.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-cyan-500/10 px-3 py-2 text-sm text-cyan-400"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* SALARY */}

              {(selectedJob.salaryMin ||
                selectedJob.salaryMax) && (

                <div>

                  <h3 className="text-lg font-bold">
                    Salary
                  </h3>

                  <p className="mt-2 text-gray-400">
                    ₹
                    {selectedJob.salaryMin || "—"}
                    {" - "}
                    ₹
                    {selectedJob.salaryMax || "—"}
                  </p>

                </div>

              )}

              {/* APPLICATION */}

              {alreadyApplied(selectedJob.id) ? (

                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">

                  <p className="font-semibold text-green-400">
                    ✓ You have already applied for this job.
                  </p>

                  <button
                    onClick={() => {
                      setSelectedJob(null);
                      setActiveTab("applications");
                    }}
                    className="mt-4 rounded-lg border border-green-500/30 px-4 py-2 text-sm text-green-400 hover:bg-green-500/10"
                  >
                    View Application Status
                  </button>

                </div>

              ) : (

                <div>

                  <h3 className="text-lg font-bold">
                    Apply for this position
                  </h3>

                  <textarea
                    value={coverLetter}
                    onChange={(e) =>
                      setCoverLetter(e.target.value)
                    }
                    rows={6}
                    placeholder="Write a short cover letter..."
                    className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
                  />

                  <button
                    onClick={applyForJob}
                    disabled={applying}
                    className="mt-4 w-full rounded-xl bg-cyan-500 px-6 py-4 font-semibold hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {applying
                      ? "Submitting Application..."
                      : "Submit Application"}
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </main>
  );
}