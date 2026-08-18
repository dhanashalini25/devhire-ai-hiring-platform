import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =========================================================
          NAVIGATION
      ========================================================= */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* LOGO */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Dev<span className="text-blue-500">Hire</span>
          </Link>

          {/* NAVIGATION LINKS */}
          <div className="hidden gap-8 text-sm text-slate-300 md:flex">

            <Link
              href="#features"
              className="hover:text-white"
            >
              Features
            </Link>

            <Link
              href="#how-it-works"
              className="hover:text-white"
            >
              How It Works
            </Link>

            <Link
              href="#about"
              className="hover:text-white"
            >
              About
            </Link>

          </div>

          {/* LOGIN / GET STARTED */}
          <div className="flex gap-3">

            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
            >
              Get Started
            </Link>

          </div>

        </div>
      </nav>


      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden">

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">

          {/* LEFT */}
          <div>

            <div className="mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              AI-Powered Developer Hiring
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Hire the right
              <span className="text-blue-500"> developers </span>
              faster.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              DevHire connects talented developers with the right
              opportunities using AI-powered candidate matching,
              intelligent recruitment workflows, and explainable insights.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-center font-semibold transition hover:bg-blue-500"
              >
                Find Developer Jobs
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-slate-700 px-7 py-3.5 text-center font-semibold text-slate-200 transition hover:bg-slate-900"
              >
                Hire Developers
              </Link>

            </div>

            {/* STATS */}
            <div className="mt-10 flex gap-8 text-sm text-slate-400">

              <div>
                <p className="text-2xl font-bold text-white">
                  AI
                </p>
                <p>Smart Matching</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  100%
                </p>
                <p>Explainable</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  24/7
                </p>
                <p>Recruitment</p>
              </div>

            </div>

          </div>


          {/* RIGHT - MATCH CARD */}
          <div className="relative">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    AI Candidate Match
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Backend Engineer
                  </h2>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500 text-xl font-bold">
                  92%
                </div>

              </div>


              <div className="mt-8 space-y-5">

                {/* PYTHON */}
                <div>

                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">
                      Python
                    </span>

                    <span className="text-green-400">
                      Matched
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-full rounded-full bg-green-500" />
                  </div>

                </div>


                {/* FASTAPI */}
                <div>

                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">
                      FastAPI
                    </span>

                    <span className="text-green-400">
                      Matched
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-11/12 rounded-full bg-green-500" />
                  </div>

                </div>


                {/* POSTGRESQL */}
                <div>

                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">
                      PostgreSQL
                    </span>

                    <span className="text-green-400">
                      Matched
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-10/12 rounded-full bg-green-500" />
                  </div>

                </div>


                {/* AWS */}
                <div>

                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">
                      AWS
                    </span>

                    <span className="text-yellow-400">
                      Partial
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-5/12 rounded-full bg-yellow-500" />
                  </div>

                </div>

              </div>


              {/* INSIGHT */}
              <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4">

                <p className="text-sm font-semibold text-white">
                  AI Compatibility Insight
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Strong backend alignment with excellent Python and API
                  experience. AWS knowledge is the primary skill gap.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section
        id="features"
        className="border-t border-slate-800 bg-slate-900/40"
      >

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Platform
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Intelligent hiring from start to finish
            </h2>

            <p className="mt-4 text-slate-400">
              Everything recruiters and developers need in one platform.
            </p>

          </div>


          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <Feature
              title="AI Matching"
              description="Match candidates to jobs using skills, requirements, embeddings, and compatibility analysis."
            />

            <Feature
              title="Smart Applications"
              description="Manage applications through a structured recruitment lifecycle."
            />

            <Feature
              title="Recruiter Workflows"
              description="Create jobs, review candidates, shortlist talent, and manage hiring pipelines."
            />

            <Feature
              title="Explainable Insights"
              description="Understand why a candidate matches a role and identify missing skills."
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section id="how-it-works">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              From application to intelligent matching
            </h2>

          </div>


          <div className="mt-14 grid gap-8 md:grid-cols-4">

            <Step
              number="01"
              title="Create Profile"
              description="Developers create profiles and upload their resumes."
            />

            <Step
              number="02"
              title="Create Job"
              description="Recruiters publish jobs with required skills and requirements."
            />

            <Step
              number="03"
              title="AI Analysis"
              description="DevHire analyzes candidate and job requirements."
            />

            <Step
              number="04"
              title="Match & Hire"
              description="Recruiters receive compatibility scores and actionable insights."
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          ABOUT / CTA
      ========================================================= */}
      <section
        id="about"
        className="border-t border-slate-800"
      >

        <div className="mx-auto max-w-5xl px-6 py-24 text-center">

          <h2 className="text-3xl font-bold md:text-5xl">
            Build better teams with AI.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            DevHire brings intelligent matching and modern recruitment
            workflows together in one developer-focused hiring platform.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-500"
          >
            Get Started
          </Link>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 DevHire. AI-Powered Developer Hiring Platform.
          </p>

          <p>
            Built with Next.js • TypeScript • AI
          </p>

          <Link
            href="/login"
            className="text-slate-400 hover:text-white"
          >
            Login
          </Link>

        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40">

      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
        ✦
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   STEP COMPONENT
========================================================= */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <span className="text-sm font-bold text-blue-500">
        {number}
      </span>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

    </div>
  );
}