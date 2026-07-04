import { useState } from "react";

function App() {
  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);
  // State to store the current sort type (either "date" or "priority")
  const [sortType, setSortType] = useState("date"); // Default to sorting by date
  // State to store the current sort order (either "asc" or "desc")
  const [sortOrder, setSortOrder] = useState("asc"); // Default to ascending order
  // State to manage visibility of sections (task list, active tasks, completed tasks)
  const [openSection, setOpenSection] = useState({
    taskList: false,
    tasks: true,
    completedTasks: true,
  });

  // Toggle visibility of a specific section based on its name
  function toggleSection(section) {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  // Add a new task to the tasks array
  function addTask(task) {
    setTasks([...tasks, { ...task, completed: false, id: Date.now() }]);
  }

  // Delete a task by its unique ID
  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // Mark a task as completed by updating its "completed" property
  function completeTask(id) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: true } : task)));
  }

  // Sort the tasks array based on the selected type (priority or date) and order
  function sortTask(tasks) {
    return tasks.slice().sort((a, b) => {
      if (sortType === "priority") {
        // Define priority levels with numerical values for comparison
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        // Sort by priority in ascending or descending order based on sortOrder
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        // Sort by date in ascending or descending order based on sortOrder
        return sortOrder === "asc"
          ? new Date(a.deadline) - new Date(b.deadline)
          : new Date(b.deadline) - new Date(a.deadline);
      }
    });
  }

  // Toggle the sort order or type based on the selected sort type
  function toggleSortOrder(type) {
    if (sortType === type) {
      // If the same sort type is clicked, change the order (asc <-> desc)
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a different sort type is selected, reset to ascending order
      setSortType(type);
      setSortOrder("asc");
    }
  }

  // Get sorted active tasks (not completed) and completed tasks
  const activeTasks = sortTask(tasks.filter((task) => !task.completed));
  const completedTasks = sortTask(tasks.filter((task) => task.completed));

  return (
    <div className="app">
      <div className="task-container">
        <h1>Task List with Priority</h1>
        {/* Toggle visibility of the task list section */}
        <button
          className={`close-button ${openSection.taskList ? "open" : ""}`}
          onClick={() => toggleSection("taskList")}
        >
          +
        </button>
        {openSection.taskList && <TaskForm addTask={addTask} />}
      </div>
      <div className="task-container">
        <h2>Tasks</h2>
        {/* Toggle visibility of the active tasks section */}
        <button
          className={`close-button ${openSection.tasks ? "open" : ""}`}
          onClick={() => toggleSection("tasks")}
        >
          +
        </button>

        {/* Sorting controls */}
        <div className="sort-controls">
          {/* Button to sort by date */}
          <button
            className={`sort-button ${sortType === "date" ? "active" : ""}`}
            onClick={() => toggleSortOrder("date")}
          >
            By Date {sortType === "date" && (sortOrder === "asc" ? "\u2191" : "\u2193")}
          </button>
          {/* Button to sort by priority */}
          <button
            className={`sort-button ${sortType === "priority" ? "active" : ""}`}
            onClick={() => toggleSortOrder("priority")}
          >
            By Priority {sortType === "priority" && (sortOrder === "asc" ? "\u2191" : "\u2193")}
          </button>
        </div>
        {/* Display sorted active tasks */}
        {openSection.tasks && (
          <TaskList completeTask={completeTask} deleteTask={deleteTask} activeTasks={activeTasks} />
        )}
      </div>
      <div className="completed-task-container">
        <h2>Completed Task</h2>
        {/* Toggle visibility of the completed tasks section */}
        <button
          className={`close-button ${openSection.completedTasks ? "open" : ""}`}
          onClick={() => toggleSection("completedTasks")}
        >
          +
        </button>
        {/* Display sorted completed tasks */}
        {openSection.completedTasks && (
          <CompletedTaskList deleteTask={deleteTask} completedTasks={completedTasks} />
        )}
      </div>
      <Footer />
    </div>
  );
}

// Form for adding new tasks
function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

  // Handle form submission to add a new task
  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() && deadline) {
      addTask({ title, priority, deadline });
      setTitle("");
      setPriority("Low");
      setDeadline("");
    }
  }

  return (
    <form action="" className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        placeholder="Task title"
        required
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="datetime-local"
        required
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit">Add task</button>
    </form>
  );
}

// List of active tasks
function TaskList({ activeTasks, deleteTask, completeTask }) {
  return (
    <ul className="task-list">
      {activeTasks.map((task) => (
        <TaskItem completeTask={completeTask} deleteTask={deleteTask} task={task} key={task.id} />
      ))}
    </ul>
  );
}

// List of completed tasks
function CompletedTaskList({ completedTasks, deleteTask }) {
  return (
    <ul className="completed-task-list">
      {completedTasks.map((task) => (
        <TaskItem key={task.id} task={task} deleteTask={deleteTask} />
      ))}
    </ul>
  );
}

// Display a single task item
function TaskItem({ task, deleteTask, completeTask }) {
  const { title, priority, deadline, id, completed } = task;

  return (
    <li className={`task-item ${priority.toLowerCase()}`}>
      <div className="task-info">
        <div>
          {title} <strong>{priority}</strong>
        </div>
        <div className="task-deadline">Due: {new Date(deadline).toLocaleString()}</div>
      </div>
      <div className="task-buttons">
        {/* Show complete button only for active tasks */}
        {!completed && (
          <button className="complete-button" onClick={() => completeTask(id)}>
            Complete
          </button>
        )}
        {/* Delete button to remove the task */}
        <button className="delete-button" onClick={() => deleteTask(id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

// Footer component with description of technologies used
function Footer() {
  return (
    <footer className="footer">
      <p>
        Technologies and React concepts used: React, JSX, props, useState, component composition,
        conditional rendering, array methods (map, filter), event handling.
      </p>
    </footer>
  );
}

export default App;
