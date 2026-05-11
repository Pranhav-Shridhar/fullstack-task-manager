import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const res = await axios.post(API_URL, {
        title,
      });

      setTasks([res.data, ...tasks]);

      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);

      setTasks(
        tasks.map((task) =>
          task._id === id ? res.data : task
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Task Manager
        </h1>

        <form
          onSubmit={createTask}
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="bg-black text-white px-5 rounded-lg"
          >
            Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">
            No tasks yet
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                <p
                  onClick={() => toggleTask(task._id)}
                  className={`cursor-pointer ${
                    task.completed
                      ? "line-through text-gray-400"
                      : ""
                  }`}
                >
                  {task.title}
                </p>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;