import { useEffect } from "react";
import { useState } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, deleteTask, completeTask }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ul className="task-list">
      {tasks.map((t, index) => {
        return (
          <TaskItem
            completeTask={completeTask}
            deleteTask={deleteTask}
            isOverdue={new Date(t.deadline) < currentTime}
            key={t.id}
            t={t}
            index={index + 1}
          />
        );
      })}
    </ul>
  );
}
