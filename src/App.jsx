import { use } from "react";
import { useState } from "react";

export default function App() {
  // =========================
  // STATE (источник данных)
  // =========================
  const [tasks, setTasks] = useState([]);

  const [open, setOpen] = useState({
    taskForm: false,
    taskActiveList: false,
    taskCompletedList: false,
  });

  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");

  // =========================
  // DERIVED DATA (вычисления)
  // =========================
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const visibleTasks = [...activeTasks];

  // =========================
  // ACTIONS (изменение state)
  // =========================
  function setOpenList(list) {
    setOpen((prev) => ({
      ...prev,
      [list]: !prev[list],
    }));
  }

  function addTask(newTask) {
    setTasks((prev) => [...prev, newTask]);
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function completeTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t)),
    );
  }

  function handleSort(field) {
    if (sortBy !== field) {
      setSortBy(field);
      setOrder("asc");
      return;
    }

    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  if (sortBy === "date") {
    visibleTasks.sort((a, b) => {
      const diff = new Date(a.deadline) - new Date(b.deadline);
      return order === "asc" ? diff : -diff;
    });
  }

  if (sortBy === "priority") {
    const priorityMap = {
      Low: 1,
      Medium: 2,
      High: 3,
    };

    visibleTasks.sort((a, b) => {
      const diff = priorityMap[a.priority] - priorityMap[b.priority];
      return order === "asc" ? diff : -diff;
    });
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="app">
      <div className="task-container">
        <h1>Task List with priority</h1>
        <button
          onClick={() => setOpenList("taskForm")}
          className={`close-button ${open.taskForm ? "open" : ""}`}
        >
          +
        </button>
        {!open.taskForm && <TaskForm addTask={addTask} />}
      </div>
      <div className="task-container">
        <h1>Tasks:</h1>
        <button
          onClick={() => setOpenList("taskActiveList")}
          className={`close-button ${open.taskActiveList ? "open" : ""}`}
        >
          +
        </button>
        {!open.taskActiveList && (
          <>
            <div className="sort-controls">
              <button
                onClick={() => handleSort("date")}
                className="sort-button"
              >
                By date {sortBy === "date" && order === "asc" ? "⬆" : "⬇"}
              </button>
              <button
                onClick={() => handleSort("priority")}
                className="sort-button"
              >
                By priority{" "}
                {sortBy === "priority" && order === "asc" ? "⬆" : "⬇"}
              </button>
            </div>
            <TaskList
              completeTask={completeTask}
              deleteTask={deleteTask}
              tasks={visibleTasks}
            />
          </>
        )}
      </div>
      <div className="completed-task-container">
        <h1>Completed task</h1>
        <button
          onClick={() => setOpenList("taskCompletedList")}
          className={`close-button ${open.taskCompletedList ? "open" : ""}`}
        >
          +
        </button>
        {!open.taskCompletedList && (
          <CompletedTaskList deleteTask={deleteTask} tasks={completedTasks} />
        )}
      </div>
      <Footer />
    </div>
  );
}

// Components
function TaskForm({ addTask }) {
  // 1. State
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

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

function TaskList({ tasks, deleteTask, completeTask }) {
  return (
    <ul className="task-list">
      {tasks.map((t, index) => {
        return (
          <TaskItem
            completeTask={completeTask}
            deleteTask={deleteTask}
            key={t.id}
            t={t}
            index={index + 1}
          />
        );
      })}
    </ul>
  );
}

function CompletedTaskList({ tasks, deleteTask }) {
  return (
    <ul className="completed-task-list">
      {tasks.map((t, index) => {
        return (
          <TaskItem
            key={t.id}
            t={t}
            index={index + 1}
            deleteTask={deleteTask}
          />
        );
      })}
    </ul>
  );
}

function TaskItem({ t, index, deleteTask, completeTask }) {
  const { title, priority, deadline, id, completed } = t;

  return (
    <li className={`task-item ${priority.toLowerCase()}`}>
      <div className="task-info">
        #{index} Task - {priority}
        <div>
          <strong>{title}</strong>
        </div>
        <div className="task-deadline">Due: {deadline}</div>
      </div>
      <div className="task-buttons">
        {!completed && (
          <button onClick={() => completeTask(id)} className="complete-button">
            Complete
          </button>
        )}
        <button onClick={() => deleteTask(id)} className="delete-button">
          Delete
        </button>
      </div>
    </li>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Technologies and React concepts used: React, JSX, props, useState,
        component composition, conditional rendering, array methods (map,
        filter), event handling.
      </p>
    </footer>
  );
}
