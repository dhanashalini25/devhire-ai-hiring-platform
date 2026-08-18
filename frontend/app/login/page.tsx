"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Save authentication information
      localStorage.setItem("devhire_token", data.token);

      localStorage.setItem(
        "devhire_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem("devhire_role", data.user.role);

      // Redirect according to role
      if (data.user.role === "RECRUITER") {
        router.push("/recruiter");
      } else {
        router.push("/candidate");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
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

      {/* LOGIN AREA */}
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* CARD */}
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

            {/* ROLE SELECTOR */}
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1">

              <button
                type="button"
                onClick={() => setRole("CANDIDATE")}
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
                onClick={() => setRole("RECRUITER")}
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

            {/* LOGIN FORM */}
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
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            {/* TEST ACCOUNTS */}
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Test Accounts
              </p>

              <div className="space-y-2 text-xs text-gray-400">

                <p>
                  <span className="font-semibold text-gray-300">
                    Candidate:
                  </span>{" "}
                  candidate@test.com
                </p>

                <p>
                  <span className="font-semibold text-gray-300">
                    Password:
                  </span>{" "}
                  Test@12345
                </p>

              </div>

            </div>

          </div>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-500">
            © 2026 DevHire. All rights reserved.
          </p>

        </div>

      </section>

    </main>
  );
}