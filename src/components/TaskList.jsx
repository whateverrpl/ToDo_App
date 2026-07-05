import TaskItem from "./TaskItem";

export default function TaskList({ tasks, deleteTask, completeTask }) {
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
