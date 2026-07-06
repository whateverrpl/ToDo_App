export default function TaskItem({
  t,
  index,
  deleteTask,
  completeTask,
  isOverdue,
}) {
  const { title, priority, deadline, id, completed } = t;

  return (
    <li
      className={`task-item ${priority.toLowerCase()} ${isOverdue ? "overdue" : ""}`}
    >
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
