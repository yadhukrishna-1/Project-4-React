import React, { useState, useEffect } from 'react';

// Constant demo users
const DEMO_USERS = [
  {
    id: 1,
    name: 'Abhinav S',
    role: 'admin',
    isAdminHR: true,
    department: 'Administration',
    email: 'superadmin@hrmconnect.com',
    username: 'superadmin',
    password: 'superadmin123'
  },
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
  { id: 1, name: 'Administration', description: 'Administrative department' },
  { id: 2, name: 'Production', description: 'Production department' }
];

function AdminDashboard({ user }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [leaves, setLeaves] = useState([]); // ✅ Manage leave requests

  // Employee states
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '', role: 'employee', department: '', email: '', username: '', password: ''
  });

  // Department states
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });

  // Edit/Delete states
  const [editEmployee, setEditEmployee] = useState(null);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [showEditDepartment, setShowEditDepartment] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [removalReason, setRemovalReason] = useState('resignation');

  const [auditLog, setAuditLog] = useState([]);

  // Load initial data
  useEffect(() => {
    let empData = JSON.parse(localStorage.getItem('employees')) || [...DEMO_USERS];
    // Ensure demo users exist
    DEMO_USERS.forEach(demo => {
      if (!empData.some(e => e.username === demo.username)) empData.push(demo);
    });
    setEmployees(empData);
    localStorage.setItem('employees', JSON.stringify(empData));

    let deptData = JSON.parse(localStorage.getItem('departments')) || [...defaultDept];
    setDepartments(deptData);
    localStorage.setItem('departments', JSON.stringify(deptData));

    const savedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];
    setLeaves(savedLeaves);

    const savedLog = JSON.parse(localStorage.getItem('auditLog')) || [];
    setAuditLog(savedLog);
  }, []);

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // ✅ Update leave request status
  const updateLeaveStatus = (leaveId, field, status) => {
    const updated = leaves.map(lv =>
      lv.id === leaveId ? { ...lv, [field]: status } : lv
    );
    setLeaves(updated);
    saveToLocalStorage('leaves', updated);
  };

  // Add employee
  const addEmployee = () => {
    const emp = { ...newEmployee, id: Date.now(), isAdminHR: false };
    const updated = [...employees, emp];
    setEmployees(updated);
    saveToLocalStorage('employees', updated);

    const log = [...auditLog, {
      id: Date.now(), type: 'addition', employeeName: emp.name, hrName: user.name, timestamp: new Date().toISOString()
    }];
    setAuditLog(log);
    saveToLocalStorage('auditLog', log);

    setNewEmployee({ name: '', role: 'employee', department: '', email: '', username: '', password: '' });
    setShowAddEmployee(false);
  };

  // Add department
  const addDepartment = () => {
    const dept = { ...newDepartment, id: Date.now() };
    const updated = [...departments, dept];
    setDepartments(updated);
    saveToLocalStorage('departments', updated);
    setNewDepartment({ name: '', description: '' });
    setShowAddDepartment(false);
  };

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const managers = employees.filter(e => e.role === 'manager').length;
  const admins = employees.filter(e => e.role === 'admin').length;
  const isAdminHR = user?.isAdminHR;

  return (
    <div>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>Employees</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')}>Departments</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'leaveRequests' ? 'active' : ''}`} onClick={() => setActiveTab('leaveRequests')}>Leave Requests</button>
        </li>
      </ul>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          <h5>Overview</h5>
          <p>Total Employees: {totalEmployees}</p>
          <p>Total Departments: {totalDepartments}</p>
          <p>Managers: {managers}</p>
          <p>Admins: {admins}</p>
        </div>
      )}

      {/* Employees */}
      {activeTab === 'employees' && (
        <div>
          <h5>Employees</h5>
          <button className="btn btn-primary mb-3" onClick={() => setShowAddEmployee(true)}>Add Employee</button>
          <table className="table table-striped">
            <thead>
              <tr><th>Name</th><th>Role</th><th>Department</th><th>Email</th></tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}><td>{emp.name}</td><td>{emp.role}</td><td>{emp.department}</td><td>{emp.email}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Departments */}
      {activeTab === 'departments' && (
        <div>
          <h5>Departments</h5>
          <button className="btn btn-primary mb-3" onClick={() => setShowAddDepartment(true)}>Add Department</button>
          <table className="table table-striped">
            <thead><tr><th>Name</th><th>Description</th></tr></thead>
            <tbody>{departments.map(d => <tr key={d.id}><td>{d.name}</td><td>{d.description}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {/* ✅ Leave Requests */}
      {activeTab === 'leaveRequests' && (
        <div>
          <h5>Leave Requests</h5>
          {leaves.length === 0 ? <p>No leave requests yet.</p> : (
            <ul className="list-group">
              {leaves.map(leave => {
                const employee = employees.find(e => e.id === leave.employeeId);
                return (
                  <li key={leave.id} className="list-group-item d-flex justify-content-between">
                    <div>
                      <strong>{employee?.name || 'Unknown'}</strong> ({leave.startDate} → {leave.endDate})  
                      <div>Reason: {leave.reason}</div>
                      <div>Manager: {leave.managerStatus || 'Pending'}, Admin: {leave.adminStatus || 'Pending'}</div>
                    </div>
                    <div>
                      {!leave.managerStatus && (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => updateLeaveStatus(leave.id, 'managerStatus', 'approved')}>Manager Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateLeaveStatus(leave.id, 'managerStatus', 'rejected')}>Reject</button>
                        </>
                      )}
                      {leave.managerStatus === 'approved' && !leave.adminStatus && (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => updateLeaveStatus(leave.id, 'adminStatus', 'approved')}>Admin Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateLeaveStatus(leave.id, 'adminStatus', 'rejected')}>Reject</button>
                        </>
                      )}
                      {leave.adminStatus && (
                        <span className={`badge ${leave.adminStatus === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                          {leave.adminStatus}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
