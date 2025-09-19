import React, { useState, useEffect } from 'react';
import LeaveCalendar from './LeaveCalendar';


function ManagerDashboard() {
  // 🔄 State management for dashboard data
  const [activeTab, setActiveTab] = useState('myTeam'); // Current active tab
  const [employees, setEmployees] = useState([]); // All employees
  const [departments, setDepartments] = useState([]); // Departments
  const [tasks, setTasks] = useState([]); // All tasks
  const [manager, setManager] = useState(null); // Logged-in manager
  const [leaves, setLeaves] = useState([]); // Leave requests

  const [showTaskModal, setShowTaskModal] = useState(false); // Modal for adding tasks
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' }); // New task form
  
  const [showPerformanceModal, setShowPerformanceModal] = useState(false); // Modal for performance
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee for performance
  const [performanceLevel, setPerformanceLevel] = useState(''); // Performance level

  useEffect(() => {
    // Fetch employees, departments, tasks, leaves from localStorage
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    const storedDepartments = JSON.parse(localStorage.getItem('departments')) || [];
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];

    setEmployees(storedEmployees);
    setDepartments(storedDepartments);
    setTasks(storedTasks);
    setLeaves(storedLeaves);

    // Simulate logged-in manager from localStorage or context
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.role === 'manager') {
      setManager(loggedInUser);
    }
  }, []);

  // Filter employees by manager's department
  const teamMembers = employees.filter(emp => emp.department === (manager ? manager.department : '') && emp.role === 'employee');

  // Filter tasks assigned to team members
  const teamTasks = tasks.filter(task => teamMembers.some(member => member.id === Number(task.assignedTo)));

  // Calculate task stats
  const completedTasks = teamTasks.filter(task => task.status === 'completed').length;
  const activeTasks = teamTasks.filter(task => task.status === 'active').length;

  // Handle task modal open
  const openTaskModal = () => {
    setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
    setShowTaskModal(true);
  };

  // Handle task modal close
  const closeTaskModal = () => {
    setShowTaskModal(false);
  };


 const clearTasks = () => {
    localStorage.setItem('tasks', JSON.stringify([])); 
    setTasks([]); // Clear tasks in state too
    alert('All tasks cleared!');
  };

  // Handle new task input change
  const handleTaskChange = (field, value) => {
    setNewTask({ ...newTask, [field]: value });
  };

  // Save new task
  const saveTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      alert('Please provide task title and assignee.');
      return;
    }
    const taskToSave = {
      ...newTask,
      id: Date.now(),
      assignedBy: manager.id,
      status: 'active',
      assignedTo: Number(newTask.assignedTo) // Ensure assignedTo is a number>>>>>>>>>>>>>>>>>>>>>>>
    };
    const updatedTasks = [...tasks, taskToSave];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setShowTaskModal(false);
  };



    // Handle performance modal open
  const openPerformanceModal = (employee) => {
    setSelectedEmployee(employee);
    setPerformanceLevel(employee.performance || '');
    setShowPerformanceModal(true);
  };

  // Handle performance modal close
  const closePerformanceModal = () => {
    setShowPerformanceModal(false);
    setSelectedEmployee(null);
    setPerformanceLevel('');
  };

  // Update performance level
  const savePerformance = () => {
    if (!selectedEmployee) return;
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return { ...emp, performance: performanceLevel };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    closePerformanceModal();
  };



  // Update leave request status
    const updateLeaveStatus = (leaveId, status) => {
    const updatedLeaves = leaves.map(leave =>
      leave.id === leaveId ? { ...leave, managerStatus: status } : leave
    );
    setLeaves(updatedLeaves);
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
  };


  return (
    <div>
      {/* Tab Navigation: Simple button-based tabs for switching views */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'myTeam' ? 'active' : ''}`} onClick={() => setActiveTab('myTeam')}>My Team</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'task' ? 'active' : ''}`} onClick={() => setActiveTab('task')}>Task</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>Performance</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'leaves' ? 'active' : ''}`} onClick={() => setActiveTab('leaves')}>Leaves</button>
        </li>
      </ul>

      {/*  My Team Tab Content */}
      {activeTab === 'myTeam' && (
        <>
          {/*  Stats Row: Grid layout for summary cards */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-primary">{teamMembers.length}</h3>
                  <p className="text-muted">Team Members</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-success">{completedTasks}</h3>
                  <p className="text-muted">Completed Tasks</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-warning">{activeTasks}</h3>
                  <p className="text-muted">Active Tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/*  Team Members Card */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Team Members</h5>
              <small className="text-muted">Manage your direct reports</small>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {teamMembers.map((member) => (
                  <li key={member.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: '45px', height: '45px', color: 'white', fontWeight: 'bold' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="fw-bold">{member.name}</div>
                        <small className="text-muted">{member.email}</small>
                        <br />
                          <small className="text-muted">{member.department}</small>
                      </div>
                    </div>
                    <div>
                      <span className={`badge ${member.performance === "Excellent" ? "bg-success" : member.performance === "Average" ? "bg-warning" : "bg-secondary"} me-2`}>
                        {member.performance || 'N/A'}
                      </span>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => openPerformanceModal(member)}>Set Performance</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/*  Task Tab Content */}
      {activeTab === 'task' && (
        <>
          {/* 📋 Task Stats Row */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-success">{completedTasks}</h3>
                  <p className="text-muted">Completed Tasks</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-warning">{activeTasks}</h3>
                  <p className="text-muted">Active Tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/*  Task Management Card */}
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
                        <span className={`badge ${task.status === 'completed' ? 'bg-success' : task.status === 'active' ? 'bg-warning' : 'bg-secondary'} me-2`}>
                          {task.status === 'active' ? 'In Progress' : task.status}
                        </span>
                        {task.status === 'active' && (
                          <button className="btn btn-outline-success btn-sm" onClick={() => {
                            const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t);
                            setTasks(updatedTasks);
                            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                          }}>Mark Complete</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button onClick={clearTasks} className='btn btn-danger float-end'>Clear All Tasks</button>
        </>
      )}

      {/*  Performance Tab Content */}
      {activeTab === 'performance' && (
        <>
          {/* 🎯 Performance Overview Row */}
          <div className="row mb-4">
            <div className="col-md-12 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-info">Team Performance Overview</h3>
                  <p className="text-muted">Monitor and analyze team performance</p>
                </div>
              </div>
            </div>
          </div>

          {/*  Performance Metrics Card */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Performance Metrics</h5>
              <small className="text-muted">Track individual and team performance</small>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {teamMembers.map((member) => (
                  <li key={member.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: '45px', height: '45px', color: 'white', fontWeight: 'bold' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="fw-bold">{member.name}</div>
                        <small className="text-muted">{member.department}</small>
                      </div>
                    </div>
                    <div>
                      <span className={`badge ${member.performance === "Excellent" ? "bg-success" : member.performance === "Average" ? "bg-warning" : "bg-secondary"} me-2`}>
                        {member.performance || 'N/A'}
                      </span>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => openPerformanceModal(member)}>Set Performance</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

{/* leave tab content */}
      {activeTab === 'leaves' && (
        <div>
          <h5 className="mb-3">Leave Requests</h5>
          <div className="card">
            <div className="card-body">
              {(() => {
                const teamLeaves = leaves.filter(leave =>
                  teamMembers.some(member => member.id === Number(leave.employeeId))
                );
                if (teamLeaves.length === 0) return <p>No leave requests.</p>;
                return (
                  <ul className="list-group">
                    {teamLeaves.map((leave) => (
                      <li key={leave.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{employees.find(e => e.id === leave.employeeId)?.name || 'Employee'}</div>
                          <small>{leave.startDate} → {leave.endDate}</small>
                          <div><small>Reason: {leave.reason}</small></div>
                        </div>
                        <div>
                          {!leave.managerStatus ? (
                            <>
                              <button className="btn btn-success btn-sm me-2" onClick={() => updateLeaveStatus(leave.id, 'approved')}>Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateLeaveStatus(leave.id, 'rejected')}>Reject</button>
                            </>
                          ) : (
                            <span className={`badge ${leave.managerStatus === 'approved' ? 'bg-success' : 'bg-danger'}`}>{leave.managerStatus}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          </div>
        </div>
      )}






      {/*  Task Modal: Plain Bootstrap modal for adding tasks */}
      <div className={`modal ${showTaskModal ? 'show' : ''}`} style={{ display: showTaskModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Task</h5>
              <button type="button" className="btn-close" onClick={closeTaskModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTask.title}
                    onChange={(e) => handleTaskChange('title', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => handleTaskChange('description', e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Assign To</label>
                  <select
                    className="form-select"
                    value={newTask.assignedTo}
                    onChange={(e) => handleTaskChange('assignedTo', e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newTask.dueDate}
                    onChange={(e) => handleTaskChange('dueDate', e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeTaskModal}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={saveTask}>Save Task</button>
            </div>
          </div>
        </div>
      </div>
      {showTaskModal && <div className="modal-backdrop show"></div>}

      {/* ⭐ Performance Modal: Plain Bootstrap modal for setting performance */}
      <div className={`modal ${showPerformanceModal ? 'show' : ''}`} style={{ display: showPerformanceModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Set Performance Level</h5>
              <button type="button" className="btn-close" onClick={closePerformanceModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Performance Level</label>
                  <select
                    className="form-select"
                    value={performanceLevel}
                    onChange={(e) => setPerformanceLevel(e.target.value)}
                  >
                    <option value="">Select Level</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closePerformanceModal}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={savePerformance}>Save</button>
            </div>
          </div>
        </div>
      </div>
      {showPerformanceModal && <div className="modal-backdrop show"></div>}
    </div>
  );
}

export default ManagerDashboard;
