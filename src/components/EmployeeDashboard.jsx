import React, { useState, useEffect } from 'react';

function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [manager, setManager] = useState(null);
  const [taskSummary, setTaskSummary] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  useEffect(() => {
    // Fetch logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    // Fetch all employees to find manager
    const allEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    if (loggedInUser) {
      const userManager = allEmployees.find(emp =>
        emp.department === loggedInUser.department && emp.role === 'manager'
      );
      setManager(userManager);
    }

    // Fetch tasks assigned to this employee
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (loggedInUser) {
      const employeeTasks = allTasks.filter(task => task.assignedTo === loggedInUser.id);
      setTasks(employeeTasks);

      // Calculate task summary
      const summary = {
        total: employeeTasks.length,
        completed: employeeTasks.filter(task => task.status === 'completed').length,
        inProgress: employeeTasks.filter(task => task.status === 'active').length,
        pending: employeeTasks.filter(task => task.status === 'pending').length
      };
      setTaskSummary(summary);
    }
  }, []);

  // Listen for localStorage changes (cross-tab updates)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'tasks') {
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (user) {
          const employeeTasks = allTasks.filter(task => task.assignedTo === user.id);
          setTasks(employeeTasks);

          // Update task summary
          const summary = {
            total: employeeTasks.length,
            completed: employeeTasks.filter(task => task.status === 'completed').length,
            inProgress: employeeTasks.filter(task => task.status === 'active').length,
            pending: employeeTasks.filter(task => task.status === 'pending').length
          };
          setTaskSummary(summary);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  // Update task status or feedback
  const updateTask = (taskId, field, value) => {
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = allTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, [field]: value };
      }
      return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    // Update local state for current user tasks
    const employeeTasks = updatedTasks.filter(task => task.assignedTo === user.id);
    setTasks(employeeTasks);

    // Update task summary
    const summary = {
      total: employeeTasks.length,
      completed: employeeTasks.filter(task => task.status === 'completed').length,
      inProgress: employeeTasks.filter(task => task.status === 'active').length,
      pending: employeeTasks.filter(task => task.status === 'pending').length
    };
    setTaskSummary(summary);
  };

  // Loading state check
  if (!user) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="lead">Welcome back, {user.name}</p>

      <div className="d-flex">
        <div className="flex-grow-1 me-3">
          <div className="card mb-3">
        <div className="card-header bg-light border-bottom-1">
          <h5 className="mb-0">My Tasks</h5>
          <small className="text-muted">Tasks assigned to you</small>
        </div>
        <div className="card-body">
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks assigned yet.</p>
          ) : (
            tasks.map((task, index) => (
              <div key={task.id || index} className="border-start border-4 border-primary ps-3 mb-3">
                <h6>{task.title}</h6>
                <p className="text-muted mb-1">{task.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Due: {task.dueDate || 'N/A'}</small>
                  <div>
                    <select
                      value={task.status}
                      onChange={(e) => updateTask(task.id, 'status', e.target.value)}
                      className="form-select form-select-sm d-inline-block me-2"
                      style={{width: 'auto'}}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Add feedback"
                      value={task.feedback || ''}
                      onChange={(e) => updateTask(task.id, 'feedback', e.target.value)}
                      className="form-control form-control-sm d-inline-block"
                      style={{width: '200px'}}
                    />
                  </div>
                </div>
                {task.feedback && (
                  <div className="mt-1 fst-italic text-muted">
                    Feedback: {task.feedback}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="card mb-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">My Profile</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4" style={{width: '60px', height: '60px'}}>
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <h5 className="mt-2 mb-0">{user.name}</h5>
                <p className="text-muted">{user.email}</p>
              </div>

              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Department:
                  <span className="fw-bold">{user.department}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Role:
                  <span className="fw-bold">{user.role}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Manager:
                  <span className="fw-bold">{manager ? manager.name : 'N/A'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Performance:
                  <span className={`badge ${user.performance === "Excellent" ? "bg-success" : user.performance === "Average" ? "bg-warning" : "bg-secondary"}`}>{user.performance || 'Not Set'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">Task Summary</h5>
            </div>
            <div className="card-body d-flex justify-content-around text-center">
              <div className="border rounded p-2 flex-fill mx-1">
                <h4 className="mb-0 text-primary">{taskSummary.total}</h4>
                <small>Total</small>
              </div>
              <div className="border rounded p-2 flex-fill mx-1">
                <h4 className="mb-0 text-success">{taskSummary.completed}</h4>
                <small>Done</small>
              </div>
              <div className="border rounded p-2 flex-fill mx-1">
                <h4 className="mb-0 text-warning">{taskSummary.inProgress}</h4>
                <small>Active</small>
              </div>
              <div className="border rounded p-2 flex-fill mx-1">
                <h4 className="mb-0 text-secondary">{taskSummary.pending}</h4>
                <small>Pending</small>
              </div>
            </div>
          </div>


        </div>
      </div>


    </div>
  );
}

// Make sure to export as default
export default EmployeeDashboard;
