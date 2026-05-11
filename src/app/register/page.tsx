"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: name || "", adminSecret }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      if (data.role === "admin") {
        router.push("/login?registered=admin");
      } else {
        router.push("/login");
      }
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-96 border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Register</h1>
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center bg-red-900 bg-opacity-30 p-2 rounded">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Admin Secret (optional)</label>
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="Leave empty for regular user"
              className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
