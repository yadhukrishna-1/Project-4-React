import React, { useState, useEffect } from 'react';

// Constant demo users
const DEMO_USERS = [
  {
    id: 1,
    name: 'Abhinav S',
    role: 'admin HR',
    isAdminHR: true,
    department: 'Administration',
    email: 'superadmin@hrmconnect.com',
    username: 'superadmin',
    password: 'superadmin123'
  }
  ,
  {
    id: 2,
    name: 'Simi ES',
    role: 'manager',
    department: 'Production',
    email: 'Simi@hrmconnect.com',
    username: 'manager1',
    password: 'manager123'
  },
  {
    id: 3,
    name: 'Ramees S',
    role: 'employee',
    department: 'Production',
    email: 'Ramees@hrmconnect.com',
    username: 'employee1',
    password: 'emp123'
  }
];

const defaultDept = [
  {
    id: 1,
    name: 'Administration',
    description: 'Administrative department'
  },
  {
    id: 2,
    name: 'Production',
    description: 'Production department'
  }
];

function AdminDashboard({ user }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'employee', department: '', email: '', username: '', password: '' });
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [activeTab, setActiveTab] = useState('overview');

  // New states for editing
  const [editEmployee, setEditEmployee] = useState(null);
  const [editDepartment, setEditDepartment] = useState(null);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'employee' or 'department'
  const [deleteError, setDeleteError] = useState(''); // Error message for delete validation

  // Audit log for employee additions and removals
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    // localStorage.removeItem('employees');
    // localStorage.removeItem('departments');
    const storedEmployees = localStorage.getItem('employees');
    const storedDepartments = localStorage.getItem('departments');
    let empData = [];

    if (storedEmployees) {
      empData = JSON.parse(storedEmployees);
      // Ensure demo users are present
      DEMO_USERS.forEach(demoUser => {
        if (!empData.find(emp => emp.username === demoUser.username && emp.password === demoUser.password)) {
          empData.push(demoUser);
        }
      });

    } else {
      empData = [...DEMO_USERS];
    }
    localStorage.setItem('employees', JSON.stringify(empData));
    setEmployees(empData);

    if (storedDepartments) {
      setDepartments(JSON.parse(storedDepartments));
    } else {
      // Add default department

      const deptData = defaultDept;
      setDepartments(deptData);
      localStorage.setItem('departments', JSON.stringify(deptData));
    }
  }, []);


  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addEmployee = () => {
    // Set role for new admins as Normal HR (isAdminHR: false)
    let roleToSet = newEmployee.role;
    let isAdminHRFlag = false;
    if (newEmployee.role === 'admin') {
      roleToSet = 'admin';
      isAdminHRFlag = false; // Normal HR
    } else {
      roleToSet = newEmployee.role;
      isAdminHRFlag = false;
    }

    const emp = { ...newEmployee, id: Date.now(), role: roleToSet, isAdminHR: isAdminHRFlag };
    const updatedEmployees = [...employees, emp];
    setEmployees(updatedEmployees);
    saveToLocalStorage('employees', updatedEmployees);

    // Log addition in audit log
    const newLogEntry = {
      id: Date.now(),
      type: 'addition',
      employeeName: emp.name,
      hrName: user.name,
      timestamp: new Date().toISOString(),
      reason: null
    };
    const updatedAuditLog = [...auditLog, newLogEntry];
    setAuditLog(updatedAuditLog);
    saveToLocalStorage('auditLog', updatedAuditLog);

    setNewEmployee({ name: '', role: 'employee', department: '', email: '', username: '', password: '' });
    setShowAddEmployee(false);
  };

  const addDepartment = () => {
    const dept = { ...newDepartment, id: Date.now() };
    const updatedDepartments = [...departments, dept];
    setDepartments(updatedDepartments);
    saveToLocalStorage('departments', updatedDepartments);
    setNewDepartment({ name: '', description: '' });
    setShowAddDepartment(false);
  };

  // Edit employee handlers
  const openEditEmployee = (emp) => {
    setEditEmployee(emp);
    setShowEditEmployee(true);
  };

  const handleEditEmployeeChange = (field, value) => {
    setEditEmployee({ ...editEmployee, [field]: value });
  };

  const saveEditEmployee = () => {
    // If current user is Admin HR and editing their own data to hand over position
    if (user.isAdminHR && editEmployee.id === user.id) {
      // If isAdminHR flag changed from true to false, find another admin to assign isAdminHR true
      if (editEmployee.isAdminHR === false) {
        // Find another admin to assign isAdminHR true
        const otherAdmins = employees.filter(emp => emp.role === 'admin' && emp.id !== editEmployee.id);
        if (otherAdmins.length > 0) {
          // Assign isAdminHR true to the first other admin
          const newAdminHR = { ...otherAdmins[0], isAdminHR: true };
          const updatedEmployees = employees.map(emp => {
            if (emp.id === newAdminHR.id) return newAdminHR;
            if (emp.id === editEmployee.id) return editEmployee;
            return emp;
          });
          setEmployees(updatedEmployees);
          saveToLocalStorage('employees', updatedEmployees);
          setShowEditEmployee(false);
          setEditEmployee(null);
          return;
        } else {
          alert('Cannot hand over Admin HR role as no other admin exists.');
          return;
        }
      }
    }

    const updatedEmployees = employees.map(emp => emp.id === editEmployee.id ? editEmployee : emp);
    setEmployees(updatedEmployees);
    saveToLocalStorage('employees', updatedEmployees);
    setShowEditEmployee(false);
    setEditEmployee(null);
  };

  // Delete employee handler
  const confirmDeleteEmployee = (emp) => {
    setDeleteTarget(emp);
    setDeleteType('employee');
    setDeleteError(''); // Reset error
    setShowDeleteConfirm(true);
  };

  // New state for removal reason
  const [removalReason, setRemovalReason] = useState('resignation');

  // Edit department handlers
  const openEditDepartment = (dept) => {
    setEditDepartment(dept);
    setShowEditDepartment(true);
  };

  const handleEditDepartmentChange = (field, value) => {
    setEditDepartment({ ...editDepartment, [field]: value });
  };

  const saveEditDepartment = () => {
    const updatedDepartments = departments.map(dept => dept.id === editDepartment.id ? editDepartment : dept);
    setDepartments(updatedDepartments);
    saveToLocalStorage('departments', updatedDepartments);
    setShowEditDepartment(false);
    setEditDepartment(null);
  };

  // Delete department handler
  const confirmDeleteDepartment = (dept) => {
    setDeleteTarget(dept);
    setDeleteType('department');
    setDeleteError(''); // Reset error
    setShowDeleteConfirm(true);
  };

  // Confirm delete action
  const handleDelete = () => {
    if (deleteType === 'employee') {
      // Check if deleting admin and if it is the last admin
      if (deleteTarget.role === 'admin') {
        const remainingAdmins = employees.filter(emp => emp.role === 'admin' && emp.id !== deleteTarget.id);
        if (remainingAdmins.length === 0) {
          setDeleteError('At least one admin must remain to manage the website.');
          return; // Prevent deletion
        }
      }

      // Log removal in audit log with reason and HR responsible
      const newLogEntry = {
        id: Date.now(),
        type: 'removal',
        employeeName: deleteTarget.name,
        hrName: user.name,
        timestamp: new Date().toISOString(),
        reason: removalReason
      };
      const updatedAuditLog = [...auditLog, newLogEntry];
      setAuditLog(updatedAuditLog);
      saveToLocalStorage('auditLog', updatedAuditLog);

      const updatedEmployees = employees.filter(emp => emp.id !== deleteTarget.id);
      setEmployees(updatedEmployees);
      saveToLocalStorage('employees', updatedEmployees);
    } else if (deleteType === 'department') {
      if (deleteTarget.name === 'Administration') {
        setDeleteError('The Administration department cannot be deleted as it is the default for managing the website.');
        return;
      }
      const updatedDepartments = departments.filter(dept => dept.id !== deleteTarget.id);
      setDepartments(updatedDepartments);
      saveToLocalStorage('departments', updatedDepartments);
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteType(null);
    setDeleteError('');
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteType(null);
    setDeleteError('');
  };

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const managers = employees.filter(emp => emp.role === 'manager').length;
  const admins = employees.filter(emp => emp.role === 'admin').length;

  // Determine if current user is Admin HR
  const isAdminHR = user?.isAdminHR === true;

  return (
    <div>
      <div className="mb-4">
        <ul className="nav nav-tabs mb-3" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              id="overview-tab-button"
              type="button"
              role="tab"
              aria-controls="overview-tab"
              aria-selected={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'employees' ? 'active' : ''}`}
              id="employees-tab-button"
              type="button"
              role="tab"
              aria-controls="employees-tab"
              aria-selected={activeTab === 'employees'}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'departments' ? 'active' : ''}`}
              id="departments-tab-button"
              type="button"
              role="tab"
              aria-controls="departments-tab"
              aria-selected={activeTab === 'departments'}
              onClick={() => setActiveTab('departments')}
            >
              Departments
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              id="analytics-tab-button"
              type="button"
              role="tab"
              aria-controls="analytics-tab"
              aria-selected={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </li>
          {isAdminHR && (
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'hrAnalysis' ? 'active' : ''}`}
                id="hrAnalysis-tab-button"
                type="button"
                role="tab"
                aria-controls="hrAnalysis-tab"
                aria-selected={activeTab === 'hrAnalysis'}
                onClick={() => setActiveTab('hrAnalysis')}
              >
                HR Analysis
              </button>
            </li>
          )}
        </ul>

        <div
          role="tabpanel"
          id="overview-tab"
          aria-labelledby="overview-tab-button"
          hidden={activeTab !== 'overview'}
          className="tab-panel"
        >
          <div className="row mb-4">
            <div className="col-3 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-primary">{totalEmployees}</h3>
                  <p className="text-muted">Total Employees</p>
                </div>
              </div>
            </div>
            <div className="col-3 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-primary">{totalDepartments}</h3>
                  <p className="text-muted">Departments</p>
                </div>
              </div>
            </div>
            <div className="col-3 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-primary">{managers}</h3>
                  <p className="text-muted">Managers</p>
                </div>
              </div>
            </div>
            <div className="col-3 mb-3">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h3 className="text-primary">{admins}</h3>
                  <p className="text-muted">Admins</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Recent Employees</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {employees.slice(-3).map((emp) => (
                      <li key={emp.id} className="list-group-item d-flex align-items-center">
                        <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px', color: 'white', fontWeight: 'bold' }}>
                          {emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold">{emp.name}</div>
                          <small className="text-muted">{emp.department}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Department Overview</h5>
                </div>
                <div className="card-body">
                  {departments.map((dept) => {
                    const empCount = employees.filter(emp => emp.department === dept.name).length;
                    return (
                      <div key={dept.id} className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">{dept.name}</span>
                          <span className="badge bg-primary">{empCount} employees</span>
                        </div>
                        <div className="progress mt-1" style={{ height: '8px' }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${totalEmployees > 0 ? (empCount / totalEmployees) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Tab */}
        <div
          role="tabpanel"
          id="employees-tab"
          aria-labelledby="employees-tab-button"
          hidden={activeTab !== 'employees'}
          className="tab-panel"
        >
          <button className="btn btn-primary mb-3" onClick={() => setShowAddEmployee(true)}>Add Employee</button>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      {emp.role === 'admin' && emp.isAdminHR
                        ? <span className="badge bg-success">{emp.name} (Admin HR)</span>
                        : emp.name}
                    </td>
                    <td>{emp.role === 'admin' ? 'Admin' : emp.role}</td>
                    <td>{emp.department}</td>
                    <td>{emp.email}</td>
                    <td>{emp.username}</td>
                    <td>{emp.password}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => openEditEmployee(emp)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => confirmDeleteEmployee(emp)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          role="tabpanel"
          id="departments-tab"
          aria-labelledby="departments-tab-button"
          hidden={activeTab !== 'departments'}
          className="tab-panel"
        >
          <button className="btn btn-primary mb-3" onClick={() => setShowAddDepartment(true)}>Add Department</button>
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.name}</td>
                    <td>{dept.description}</td>
                    <td>
                      {dept.name !== 'Administration' && (
                      <button className="btn btn-sm btn-warning me-2" onClick={() => openEditDepartment(dept)}>Edit</button>
                      )}
                      {dept.name !== 'Administration' && (
                        <button className="btn btn-sm btn-danger" onClick={() => confirmDeleteDepartment(dept)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          role="tabpanel"
          id="analytics-tab"
          aria-labelledby="analytics-tab-button"
          hidden={activeTab !== 'analytics'}
          className="tab-panel"
        >
          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-header">Employee Distribution by Role</div>
                <div className="card-body">
                  <p>Admins: {admins}</p>
                  <p>Managers: {managers}</p>
                  <p>Employees: {employees.filter(emp => emp.role === 'employee').length}</p>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-header">Department Stats</div>
                <div className="card-body">
                  {departments.map((dept) => {
                    const empCount = employees.filter(emp => emp.department === dept.name).length;
                    return <p key={dept.id}>{dept.name}: {empCount} employees</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isAdminHR && (
          <div
            role="tabpanel"
            id="hrAnalysis-tab"
            aria-labelledby="hrAnalysis-tab-button"
            hidden={activeTab !== 'hrAnalysis'}
            className="tab-panel"
          >
            <h5>Employee Additions and Removals Analysis</h5>
            {auditLog.length === 0 ? (
              <p>No audit data available.</p>
            ) : (
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Employee Name</th>
                    <th>HR Responsible</th>
                    <th>Reason (if removal)</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((log) => (
                    <tr key={log.id}>
                      <td>{log.type === 'addition' ? 'Added' : 'Removed'}</td>
                      <td>{log.employeeName}</td>
                      <td>{log.hrName}</td>
                      <td>{log.reason || '-'}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Employee</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddEmployee(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newEmployee.username}
                    onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  />
                </div>
                {/* Show Admin HR status for info only */}
                {newEmployee.role === 'admin' && (
                  <div className="mb-3">
                    <label className="form-label">Admin HR Status</label>
                    <input
                      type="text"
                      className="form-control"
                      value="Normal HR (not Admin HR)"
                      disabled
                    />
                    <small className="text-muted">Only the default admin is Admin HR. New admins are Normal HR.</small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddEmployee(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={addEmployee}>Add Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmployee && editEmployee && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Employee</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditEmployee(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editEmployee.name}
                    onChange={(e) => handleEditEmployeeChange('name', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={editEmployee.role}
                    onChange={(e) => handleEditEmployeeChange('role', e.target.value)}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={editEmployee.department}
                    onChange={(e) => handleEditEmployeeChange('department', e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editEmployee.email}
                    onChange={(e) => handleEditEmployeeChange('email', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editEmployee.username}
                    onChange={(e) => handleEditEmployeeChange('username', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={editEmployee.password}
                    onChange={(e) => handleEditEmployeeChange('password', e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditEmployee(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={saveEditEmployee}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddDepartment(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddDepartment(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={addDepartment}>Add Department</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditDepartment && editDepartment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditDepartment(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editDepartment.name}
                    onChange={(e) => handleEditDepartmentChange('name', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editDepartment.description}
                    onChange={(e) => handleEditDepartmentChange('description', e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditDepartment(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={saveEditDepartment}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this {deleteType}?</p>
                <p><strong>{deleteType === 'employee' ? deleteTarget?.name : deleteTarget?.name}</strong></p>
                {deleteError && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {deleteError}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
