import React, { useState } from 'react';

function Employees({ employees, departments, user, setEmployees, saveToLocalStorage, auditLog, setAuditLog }) {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'employee', department: '', email: '', username: '', password: '' });
  const [editEmployee, setEditEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [removalReason, setRemovalReason] = useState('resignation');

  const addEmployee = () => {
    // Set role for new admins as Normal HR (isAdminHR: false)
    let roleToSet = newEmployee.role;
    let isAdminHRFlag = false;
    if (newEmployee.role === 'admin') {
      roleToSet = 'admin';
      // Check if there is any Admin HR already
      const hasAdminHR = employees.some(emp => emp.role === 'admin' && emp.isAdminHR === true);
      isAdminHRFlag = !hasAdminHR; // Set true if no Admin HR exists
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
  
  // Edit modal: add isAdminHR checkbox visible only to Admin HR users
  const handleEditEmployeeChange = (field, value) => {
    setEditEmployee({ ...editEmployee, [field]: value });
  };

  const openEditEmployee = (emp) => {
    setEditEmployee(emp);
    setShowEditEmployee(true);
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

    // Log edit in audit log
    const newLogEntry = {
      id: Date.now(),
      type: 'edit',
      employeeName: editEmployee.name,
      hrName: user.name,
      timestamp: new Date().toISOString(),
      reason: 'Employee details updated'
    };
    const updatedAuditLog = [...auditLog, newLogEntry];
    setAuditLog(updatedAuditLog);
    saveToLocalStorage('auditLog', updatedAuditLog);

    setShowEditEmployee(false);
    setEditEmployee(null);
  };



  const confirmDeleteEmployee = (emp) => {
    setDeleteTarget(emp);
    setDeleteError(''); // Reset error
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    // Check if deleting admin and if it is the last admin
    if (deleteTarget.role === 'admin') {
      const remainingAdmins = employees.filter(emp => emp.role === 'admin' && emp.id !== deleteTarget.id);
      if (remainingAdmins.length === 0) {
        setDeleteError('At least one admin must remain to manage the website.');
        return; // Prevent deletion
      }
      // If deleting current Admin HR, assign isAdminHR to another admin
      if (deleteTarget.isAdminHR) {
        const newAdminHR = { ...remainingAdmins[0], isAdminHR: true };
        const updatedEmployees = employees.map(emp => {
          if (emp.id === newAdminHR.id) return newAdminHR;
          return emp;
        });
        setEmployees(updatedEmployees);
        saveToLocalStorage('employees', updatedEmployees);
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
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteError('');
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteError('');
  };

  return (
    <div>
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
                <td>{emp.role === 'admin' ? (emp.isAdminHR ? 'Admin HR' : 'Admin') : emp.role}</td>
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
                      value={employees.some(emp => emp.role === 'admin' && emp.isAdminHR === true) ? "Normal HR (not Admin HR)" : "Admin HR (first admin)"}
                      disabled
                    />
                    <small className="text-muted">New admins will be Admin HR if no Admin HR exists, otherwise Normal HR.</small>
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
                {user.isAdminHR && editEmployee.role === 'admin' && (
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isAdminHR"
                        checked={editEmployee.isAdminHR || false}
                        onChange={(e) => handleEditEmployeeChange('isAdminHR', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="isAdminHR">
                        Admin HR
                      </label>
                    </div>
                  </div>
                )}
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
                <p>Are you sure you want to delete this employee?</p>
                <p><strong>{deleteTarget?.name}</strong></p>
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

export default Employees;
