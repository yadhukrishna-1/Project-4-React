import React from 'react';

function TaskList({ teamTasks, tasks, setTasks, updateTaskStatus, openTaskModal }) {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Task Management</h5>
        <button className="btn btn-primary btn-sm" onClick={openTaskModal}>Add Task</button>
      </div>
      <div className="card-body">
        {teamTasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          <ul className="list-group">
            {teamTasks.map(task => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{task.title}</div>
                  <small className="text-muted">{task.description}</small>
                  <div>
                    <small className="text-muted">Due: {task.dueDate || 'N/A'}</small>
                  </div>
                  {task.feedback && (
                    <div>
                      <small className="text-muted">Feedback: {task.feedback}</small>
                    </div>
                  )}
                </div>
                <div>
                  <span
                    className={`badge ${
                      task.status === 'completed' ? 'bg-success' :
                      task.status === 'active' ? 'bg-warning' : 'bg-secondary'
                    } me-2`}
                  >
                    {task.status === 'active' ? 'In Progress' : task.status}
                  </span>
                  {task.status === 'active' && (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TaskList;
