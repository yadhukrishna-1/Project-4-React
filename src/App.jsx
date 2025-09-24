import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import './App.css';

// Demo users for initialization
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

const DEFAULT_DEPARTMENTS = [
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

function App() {
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => { setUser(userData); };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
  };



  return (
    <Router>
      <div className="App">
        {!user ? (<Login onLogin={handleLogin} />) :
          (
            <>
              {/* Navigation bar */}
              <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container-fluid">
                  <div className="d-flex align-items-center p-2">
                    <img src="media/img-3.png" alt="" width="50px" className="blue-icon me-3" />
                    <div>
                      <span className="navbar-brand text-dark d-block">HRM-Connect</span>
                      <span className="text-dark text-capitalize">{user.role} Dashboard</span>
                    </div>
                  </div>

                  <div className="navbar-nav ms-auto">
                    <span className="navbar-text me-3 text-dark">Welcome, {user.name}</span>
                    <button className="btn btn-outline-dark  btn-sm" onClick={handleLogout}> Logout </button>
                  </div>
                </div>
              </nav>

              <div className="container mt-4">
                <Routes>
<Route path="/admin" element={user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/" />} />
                  <Route path="/manager" element={user.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/" />} />
                  <Route path="/employee" element={user.role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/" />} />

                  <Route
                    path="/" element={
                      user.role === 'admin' ? <Navigate to="/admin" /> :
                        user.role === 'manager' ? <Navigate to="/manager" /> :
                          <Navigate to="/employee" />}
                  />
                </Routes>
              </div>
            </>
          )}
      </div>
    </Router>
  );
}

export default App;
