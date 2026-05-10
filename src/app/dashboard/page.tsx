"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  category: string;
  dueDate: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "general",
    dueDate: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) fetchTasks();
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
    router.push("/login");
  };

  const fetchTasks = async () => {
    setError("");
    try {
      const res = await fetch("/api/tasks", {
        credentials: "include",
      });
      if (res.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please refresh the page.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
    const method = editingTask ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingTask(null);
        setForm({ title: "", description: "", priority: "medium", category: "general", dueDate: "" });
        fetchTasks();
      }
    } catch (err) {
      setError("Failed to save task");
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed: !task.completed }),
      });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    if (confirm("Delete this task?")) {
      try {
        await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        fetchTasks();
      } catch (err) {
        setError("Failed to delete task");
      }
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && t.completed) ||
      (filter === "pending" && !t.completed);
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  if (status === "loading") return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">TaskManager</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{session?.user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="bg-red-900 text-red-200 p-3 rounded-lg mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{stats.completed}</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-3 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <button
              onClick={() => {
                setEditingTask(null);
                setForm({ title: "", description: "", priority: "medium", category: "general", dueDate: "" });
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              + Add Task
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-slate-400 py-12 text-lg">No tasks found</p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-4 ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                  className="w-6 h-6 rounded border-slate-500 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${task.completed ? "line-through text-slate-400" : "text-white"}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        task.priority === "high"
                          ? "bg-red-900 text-red-300"
                          : task.priority === "medium"
                          ? "bg-amber-900 text-amber-300"
                          : "bg-blue-900 text-blue-300"
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-300">
                      {task.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openEdit(task)}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
