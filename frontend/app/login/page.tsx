"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "process.env.NEXT_PUBLIC_API_URL";

type Role = "CANDIDATE" | "RECRUITER";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CANDIDATE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      if (!data.token) {
        throw new Error(
          "Login succeeded but no authentication token was returned."
        );
      }

      if (!data.user) {
        throw new Error(
          "Login succeeded but user information was not returned."
        );
      }

      const loggedInRole = data.user.role as Role;

      if (
        loggedInRole !== "CANDIDATE" &&
        loggedInRole !== "RECRUITER"
      ) {
        throw new Error(
          `Unsupported user role: ${data.user.role}`
        );
      }

      // Save login information
      localStorage.setItem(
        "devhire_token",
        data.token
      );

      localStorage.setItem(
        "devhire_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "devhire_role",
        loggedInRole
      );

      // Redirect based on ACTUAL backend role
      if (loggedInRole === "RECRUITER") {
        router.replace("/recruiter");
      } else {
        router.replace("/candidate");
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to connect to the backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function fillCandidateAccount() {
    setEmail("candidate@test.com");
    setPassword("Test@12345");
    setRole("CANDIDATE");
    setError("");
  }

  function fillRecruiterAccount() {
    setEmail("recruiter@test.com");
    setPassword("Test@12345");
    setRole("RECRUITER");
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Dev<span className="text-cyan-400">Hire</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-300 transition hover:text-cyan-400"
          >
            Back to Home
          </Link>

        </div>
      </header>

      {/* LOGIN */}
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

            {/* TITLE */}
            <div className="mb-8 text-center">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl">
                🔐
              </div>

              <h1 className="text-3xl font-bold">
                Welcome Back
              </h1>

              <p className="mt-2 text-gray-400">
                Login to your DevHire account
              </p>

            </div>

            {/* ROLE */}
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1">

              <button
                type="button"
                onClick={() => {
                  setRole("CANDIDATE");
                  setError("");
                }}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  role === "CANDIDATE"
                    ? "bg-cyan-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Candidate
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("RECRUITER");
                  setError("");
                }}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  role === "RECRUITER"
                    ? "bg-cyan-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Recruiter
              </button>

            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />

              </div>

              {/* LOGIN */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Logging in..."
                  : `Login as ${
                      role === "RECRUITER"
                        ? "Recruiter"
                        : "Candidate"
                    }`}
              </button>

            </form>

            {/* TEST ACCOUNTS */}
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4">

              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Test Accounts
              </p>

              {/* CANDIDATE */}
              <button
                type="button"
                onClick={fillCandidateAccount}
                className="mb-3 w-full rounded-lg border border-slate-700 p-3 text-left transition hover:border-cyan-400"
              >
                <p className="text-sm font-semibold text-white">
                  Candidate
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  candidate@test.com
                </p>

                <p className="text-xs text-gray-500">
                  Password: Test@12345
                </p>
              </button>

              {/* RECRUITER */}
              <button
                type="button"
                onClick={fillRecruiterAccount}
                className="w-full rounded-lg border border-slate-700 p-3 text-left transition hover:border-cyan-400"
              >
                <p className="text-sm font-semibold text-white">
                  Recruiter
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  recruiter@test.com
                </p>

                <p className="text-xs text-gray-500">
                  Password: Test@12345
                </p>
              </button>

            </div>

          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            © 2026 DevHire. All rights reserved.
          </p>

        </div>

      </section>

    </main>
  );
}