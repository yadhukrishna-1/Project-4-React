import React, { useState, useEffect } from 'react';
import Overview from './AdminDashboard/Overview';
import Employees from './AdminDashboard/Employees';
import Departments from './AdminDashboard/Departments';
import LeaveRequests from './AdminDashboard/LeaveRequests';
import Analytics from './AdminDashboard/Analytics';

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
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Audit log for employee additions and removals
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() =>  {
    // Load data from localStorage (initialized by index.html and Login.jsx)
    const storedEmployees = localStorage.getItem('employees');
    const storedDepartments = localStorage.getItem('departments');

    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }

    if (storedDepartments) {
      setDepartments(JSON.parse(storedDepartments));
    }

    const storedLeaves = localStorage.getItem('leaves');
    if (storedLeaves) {
      setLeaves(JSON.parse(storedLeaves));
    }
  }, []);


  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const managers = employees.filter(emp => emp.role === 'manager').length;
  const admins = employees.filter(emp => emp.role === 'admin').length;

  // Determine if current user is Admin HR
  const isAdminHR = user?.isAdminHR === true;




  // Leave Requests Tab Content
  const updateLeaveStatus = (leaveId, field, status) => {
    const updatedLeaves = leaves.map(lv => lv.id === leaveId ? { ...lv, [field]: status } : lv);
    setLeaves(updatedLeaves);
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
  };

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
              className={`nav-link ${activeTab === 'leaveRequests' ? 'active' : ''}`}
              id="leaveRequests-tab-button"
              type="button"
              role="tab"
              aria-controls="leaveRequests-tab"
              aria-selected={activeTab === 'leaveRequests'}
              onClick={() => setActiveTab('leaveRequests')}
            >
              Leave Requests
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

        {/* Over-View Tab  */}
        <div
          role="tabpanel"
          id="overview-tab"
          aria-labelledby="overview-tab-button"
          hidden={activeTab !== 'overview'}
          className="tab-panel"
        >
          <Overview employees={employees} departments={departments} />
        </div>

        {/* Employees Tab */}
        <div
          role="tabpanel"
          id="employees-tab"
          aria-labelledby="employees-tab-button"
          hidden={activeTab !== 'employees'}
          className="tab-panel"
        >
          <Employees employees={employees} departments={departments} setEmployees={setEmployees} auditLog={auditLog} setAuditLog={setAuditLog} user={user} saveToLocalStorage={saveToLocalStorage} />
        </div>

        <div
          role="tabpanel"
          id="departments-tab"
          aria-labelledby="departments-tab-button"
          hidden={activeTab !== 'departments'}
          className="tab-panel"
        >
          <Departments departments={departments} setDepartments={setDepartments} saveToLocalStorage={saveToLocalStorage} />
        </div>

        <div
          role="tabpanel"
          id="analytics-tab"
          aria-labelledby="analytics-tab-button"
          hidden={activeTab !== 'analytics'}
          className="tab-panel"
        >
          <Analytics employees={employees} departments={departments} />
        </div>

        <div
          role="tabpanel"
          id="leaveRequests-tab"
          aria-labelledby="leaveRequests-tab-button"
          hidden={activeTab !== 'leaveRequests'}
          className="tab-panel"
        >
          <LeaveRequests leaves={leaves} employees={employees} updateLeaveStatus={updateLeaveStatus} />
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
                      <td>{log.type === 'addition' ? 'Added' : log.type === 'removal' ? 'Removed' : 'Edited'}</td>
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
    </div>
  );
}

export default AdminDashboard;
