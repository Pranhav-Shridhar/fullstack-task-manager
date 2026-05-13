import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const { userInfo } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    fetchTasks();
  }, [userInfo]);

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(
        "/api/tasks",
        config
      );

      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const { data } = await api.post(
        "/api/tasks",
        { title },
        config
      );

      setTasks([data, ...tasks]);
      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(
        `/api/tasks/${id}`,
        config
      );

      setTasks(
        tasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const { data } = await api.put(
        `/api/tasks/${id}`,
        {},
        config
      );

      setTasks(
        tasks.map((task) =>
          task._id === id ? data : task
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Task Manager
          </h1>

          <p className="text-gray-500">
            Organize your daily work
          </p>
        </div>

        <form
          onSubmit={createTask}
          className="flex gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Enter a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="bg-black text-white px-6 rounded-xl hover:opacity-90 transition"
          >
            Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No tasks yet
            </p>

            <p className="text-gray-400 text-sm mt-2">
              Add your first task above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      toggleTask(task._id)
                    }
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-400"
                    }`}
                  >
                    {task.completed && (
                      <span className="text-white text-xs">
                        ✓
                      </span>
                    )}
                  </button>

                  <p
                    className={`text-lg ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {task.title}
                  </p>
                </div>

                <button
                  onClick={() =>
                    deleteTask(task._id)
                  }
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}