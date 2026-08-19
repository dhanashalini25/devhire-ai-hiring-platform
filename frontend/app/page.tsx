import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* LOGO */}

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Dev<span className="text-cyan-400">Hire</span>
          </Link>

          {/* NAVIGATION */}

          <nav className="hidden items-center gap-8 md:flex">

            <Link
              href="#features"
              className="text-sm text-gray-300 transition hover:text-cyan-400"
            >
              Features
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm text-gray-300 transition hover:text-cyan-400"
            >
              How It Works
            </Link>

            <Link
              href="#about"
              className="text-sm text-gray-300 transition hover:text-cyan-400"
            >
              About
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium text-white transition hover:text-cyan-400"
            >
              Login
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              Get Started
            </Link>

          </nav>

          {/* MOBILE LOGIN */}

          <Link
            href="/login"
            className="text-sm font-semibold text-cyan-400 md:hidden"
          >
            Login
          </Link>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden pt-20">

        {/* Background glow */}

        <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">

              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

              AI-Powered Hiring Platform

            </div>


            {/* Heading */}

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">

              Hire Smarter.

              <br />

              <span className="text-cyan-400">
                Build Faster.
              </span>

            </h1>


            {/* Description */}

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">

              DevHire connects talented candidates with recruiters
              using intelligent job matching, streamlined applications,
              and modern hiring technology.

            </p>


            {/* Buttons */}

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/login"
                className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
              >
                Find a Job
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-slate-700 px-8 py-4 text-lg font-semibold text-white transition hover:border-cyan-400 hover:bg-slate-900"
              >
                Recruit Talent
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="border-t border-slate-800 py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto mb-16 max-w-3xl text-center">

            <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-400">
              FEATURES
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Everything You Need to Hire
            </h2>

            <p className="mt-5 text-lg text-gray-400">
              A complete platform for candidates and recruiters,
              designed to make the hiring process faster and simpler.
            </p>

          </div>


          <div className="grid gap-8 md:grid-cols-3">

            {/* FEATURE 1 */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-cyan-500/50">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                🤖
              </div>

              <h3 className="mb-4 text-xl font-bold">
                AI Job Matching
              </h3>

              <p className="leading-relaxed text-gray-400">
                Match candidates with relevant job opportunities
                using intelligent skills and experience analysis.
              </p>

            </div>


            {/* FEATURE 2 */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-cyan-500/50">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                ⚡
              </div>

              <h3 className="mb-4 text-xl font-bold">
                Fast Applications
              </h3>

              <p className="leading-relaxed text-gray-400">
                Candidates can discover jobs, maintain their profiles,
                and apply quickly from one platform.
              </p>

            </div>


            {/* FEATURE 3 */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-cyan-500/50">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                📊
              </div>

              <h3 className="mb-4 text-xl font-bold">
                Recruiter Dashboard
              </h3>

              <p className="leading-relaxed text-gray-400">
                Recruiters can create jobs, review applications,
                and manage candidate hiring status.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="border-t border-slate-800 bg-slate-900/40 py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto mb-16 max-w-3xl text-center">

            <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-400">
              HOW IT WORKS
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Simple. Fast. Intelligent.
            </h2>

          </div>


          <div className="grid gap-12 md:grid-cols-3">

            {/* STEP 1 */}

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold">
                1
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Create Your Profile
              </h3>

              <p className="mt-3 leading-relaxed text-gray-400">
                Candidates and recruiters create their accounts
                and complete their profiles.
              </p>

            </div>


            {/* STEP 2 */}

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold">
                2
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Discover Opportunities
              </h3>

              <p className="mt-3 leading-relaxed text-gray-400">
                Candidates discover suitable jobs while recruiters
                publish opportunities.
              </p>

            </div>


            {/* STEP 3 */}

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold">
                3
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Connect &amp; Hire
              </h3>

              <p className="mt-3 leading-relaxed text-gray-400">
                Candidates apply and recruiters review applications
                and manage the hiring process.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="border-t border-slate-800 py-24"
      >

        <div className="mx-auto max-w-4xl px-6 text-center">

          <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-400">
            ABOUT DEVHIRE
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Modern Hiring for Modern Teams
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-400">

            DevHire is an AI-powered hiring platform built to simplify
            the connection between skilled candidates and companies.
            From discovering jobs to managing applications, DevHire
            brings the complete hiring workflow into one place.

          </p>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="border-t border-slate-800 py-24">

        <div className="mx-auto max-w-5xl px-6">

          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-10 text-center md:p-16">

            <h2 className="text-4xl font-bold md:text-5xl">
              Ready to Get Started?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              Join DevHire and take the next step in your hiring journey.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-block rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-cyan-400"
            >
              Login to DevHire
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-800">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <Link
              href="/"
              className="text-xl font-bold"
            >
              Dev<span className="text-cyan-400">
                Hire
              </span>
            </Link>

            <p className="text-sm text-gray-500">
              © 2026 DevHire. All rights reserved.
            </p>

            <Link
              href="/login"
              className="text-sm text-gray-400 transition hover:text-cyan-400"
            >
              Login
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}