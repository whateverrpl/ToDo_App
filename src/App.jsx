import { useState } from "react";
import Footer from "./components/Footer";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import CompletedTaskList from "./components/CompletedTaskList";

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

  // Sorting By
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
      <Footer>
        <p>
          Technologies and React concepts used: React, JSX, props, useState,
          useEffect, component composition, conditional rendering, array methods
          (map, filter), event handling.
        </p>
      </Footer>
    </div>
  );
}
