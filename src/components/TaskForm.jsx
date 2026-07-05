import { useState } from "react";

export default function TaskForm({ addTask }) {
  // =========================
  // STATE (источник данных)
  // =========================
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

  // =========================
  // ACTIONS (изменение state)
  // =========================
  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !deadline.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      priority,
      deadline,
      completed: false,
    };

    addTask(newTask);
    resetForm();
  }

  function resetForm() {
    setTitle("");
    setPriority("Low");
    setDeadline("");
  }

  return (
    <form onSubmit={handleSubmit} action="" className="task-form">
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        type="text"
        placeholder="Task title"
        required
      />
      <select
        onChange={(e) => setPriority(e.target.value)}
        value={priority}
        name=""
        id=""
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        onChange={(e) => setDeadline(e.target.value)}
        value={deadline}
        type="datetime-local"
      />
      <button type="submit">Add task</button>
    </form>
  );
}
