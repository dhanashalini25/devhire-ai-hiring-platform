"use client";

import Link from "next/link";

export default function CandidateDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            Dev<span className="text-cyan-400">Hire</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/candidate/dashboard"
              className="text-cyan-400"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="text-gray-400 hover:text-white"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">
          <p className="text-sm font-semibold text-cyan-400">
            CANDIDATE DASHBOARD
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Welcome to DevHire 👋
          </h1>

          <p className="mt-3 text-gray-400">
            Find jobs, track applications, and manage your profile.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-gray-400">Applications</p>
            <h2 className="mt-2 text-3xl font-bold">1</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-gray-400">Shortlisted</p>
            <h2 className="mt-2 text-3xl font-bold text-cyan-400">
              1
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-gray-400">Profile Status</p>
            <h2 className="mt-2 text-xl font-bold text-green-400">
              Active
            </h2>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <Link
            href="/jobs"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-cyan-500"
          >
            <h2 className="text-2xl font-bold">
              🔎 Find Jobs
            </h2>

            <p className="mt-3 text-gray-400">
              Browse available developer jobs and apply to suitable
              opportunities.
            </p>

            <span className="mt-6 inline-block text-cyan-400">
              Browse Jobs →
            </span>
          </Link>

          <Link
            href="/candidate/applications"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-cyan-500"
          >
            <h2 className="text-2xl font-bold">
              📋 My Applications
            </h2>

            <p className="mt-3 text-gray-400">
              Track your applications and view their current status.
            </p>

            <span className="mt-6 inline-block text-cyan-400">
              View Applications →
            </span>
          </Link>

        </div>

        {/* Current Application */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <p className="text-sm text-gray-400">
                CURRENT APPLICATION
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Junior Full Stack Developer
              </h2>

              <p className="mt-2 text-gray-400">
                Bangalore · Full Time
              </p>
            </div>

            <div className="rounded-full bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-400">
              SHORTLISTED
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}