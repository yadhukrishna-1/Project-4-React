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


  // Loading state check
  if (!user) {
    return (
      <div style={{textAlign: 'center', marginTop: '50px'}}>
        <div style={{
          border: '4px solid #e9ecef',
          borderTop: '4px solid #0d6efd',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} role="status">
          <span style={{position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>Loading...</span>
        </div>
        <p style={{marginTop: '10px'}}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{fontSize: '1.25rem', fontWeight: 300}}>Welcome back, {user.name}</p>

      <div style={{display: 'flex'}}>
        <div style={{flex: 2, marginRight: '20px'}}>
          <div style={{border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px'}}>
            <div style={{padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd'}}>
              <h5 style={{margin: 0}}>My Tasks</h5>
              <small style={{color: '#6c757d'}}>Tasks assigned to you</small>
            </div>
            <div style={{padding: '15px'}}>
              {tasks.length === 0 ? (
                <p style={{color: '#6c757d'}}>No tasks assigned yet.</p>
              ) : (
                tasks.map((task, index) => (
                  <div key={task.id || index} style={{borderLeft: '4px solid #0d6efd', paddingLeft: '15px', marginBottom: '15px'}}>
                    <h6>{task.title}</h6>
                    <p style={{color: '#6c757d', marginBottom: '5px'}}>{task.description}</p>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <small style={{color: '#6c757d'}}>Due: {task.dueDate || 'N/A'}</small>
                      <div style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: task.status === "active" ? "#ffc107" : task.status === "completed" ? "#198754" : "#6c757d",
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}>
                        {task.status === "active" ? "In Progress" : task.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{flex: 1}}>
          <div style={{border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px'}}>
            <div style={{padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd'}}>
              <h5 style={{margin: 0}}>My Profile</h5>
            </div>
            <div style={{padding: '15px'}}>
              <div style={{textAlign: 'center', marginBottom: '15px'}}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#0d6efd',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <h5 style={{marginTop: '10px', marginBottom: 0}}>{user.name}</h5>
                <p style={{color: '#6c757d'}}>{user.email}</p>
              </div>

              <div style={{padding: 0, margin: 0, listStyleType: 'none'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                  <span>Department:</span>
                  <span style={{fontWeight: 'bold'}}>{user.department}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                  <span>Role:</span>
                  <span style={{fontWeight: 'bold'}}>{user.role}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                  <span>Manager:</span>
                  <span style={{fontWeight: 'bold'}}>{manager ? manager.name : 'N/A'}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                  <span>Performance:</span>
                  <div style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: user.performance === "Excellent" ? "#198754" : user.performance === "Average" ? "#ffc107" : "#6c757d",
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {user.performance || 'Not Set'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px'}}>
            <div style={{padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd'}}>
              <h5 style={{margin: 0}}>Task Summary</h5>
            </div>
            <div style={{padding: '15px', display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div style={{border: '1px solid #ddd', borderRadius: '5px', padding: '10px', flex: 1, margin: '0 5px'}}>
                <h4 style={{margin: 0, color: '#0d6efd'}}>{taskSummary.total}</h4>
                <small>Total</small>
              </div>
              <div style={{border: '1px solid #ddd', borderRadius: '5px', padding: '10px', flex: 1, margin: '0 5px'}}>
                <h4 style={{margin: 0, color: '#198754'}}>{taskSummary.completed}</h4>
                <small>Done</small>
              </div>
              <div style={{border: '1px solid #ddd', borderRadius: '5px', padding: '10px', flex: 1, margin: '0 5px'}}>
                <h4 style={{margin: 0, color: '#ffc107'}}>{taskSummary.inProgress}</h4>
                <small>Active</small>
              </div>
              <div style={{border: '1px solid #ddd', borderRadius: '5px', padding: '10px', flex: 1, margin: '0 5px'}}>
                <h4 style={{margin: 0, color: '#6c757d'}}>{taskSummary.pending}</h4>
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