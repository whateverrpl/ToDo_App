import TaskItem from "./TaskItem";

export default function CompletedTaskList({ tasks, deleteTask }) {
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
