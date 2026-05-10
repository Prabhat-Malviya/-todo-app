"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  _count: { tasks: number };
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  category: string;
  createdAt: string;
  user: { email: string };
}

export default function AdminPage() {
  const { data: session, status } = useSession() as { data: { user: SessionUser } | null; status: string };
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "tasks">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      if (tab === "users") {
        const res = await fetch("/api/admin/users", { credentials: "include" });
        if (res.ok) setUsers(await res.json());
      } else {
        const res = await fetch("/api/admin/tasks", { credentials: "include" });
        if (res.ok) setTasks(await res.json());
      }
    } catch {
      setError("Failed to load data");
    }
  }, [tab]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && session?.user?.role !== "admin") router.push("/dashboard");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (status === "authenticated") fetchData();
  }, [status, router, session, fetchData]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user and all their tasks?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) fetchData();
      else alert("Failed to delete user");
    } catch {
      alert("Failed to delete user");
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) fetchData();
      else alert("Failed to delete task");
    } catch {
      alert("Failed to delete task");
    }
  };

  if (status === "loading") return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{session?.user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4">
        {error && <div className="bg-red-900 text-red-200 p-3 rounded-lg mb-4">{error}</div>}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("users")}
            className={`px-5 py-2 rounded-lg font-medium ${
              tab === "users" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setTab("tasks")}
            className={`px-5 py-2 rounded-lg font-medium ${
              tab === "tasks" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2 rounded-lg font-medium bg-slate-800 text-slate-300"
          >
            Back to Dashboard
          </button>
        </div>

        {tab === "users" ? (
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="text-left p-4 text-slate-300">Email</th>
                  <th className="text-left p-4 text-slate-300">Name</th>
                  <th className="text-left p-4 text-slate-300">Tasks</th>
                  <th className="text-left p-4 text-slate-300">Joined</th>
                  <th className="text-left p-4 text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-700">
                    <td className="p-4 text-white">{user.email}</td>
                    <td className="p-4 text-white">{user.name || "-"}</td>
                    <td className="p-4 text-white">{user._count.tasks}</td>
                    <td className="p-4 text-white">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${task.completed ? "line-through text-slate-400" : "text-white"}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-400">{task.user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-300">
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-300">
                      {task.category}
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-300 font-medium">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}