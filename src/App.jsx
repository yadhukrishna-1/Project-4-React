import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // Initialize demo users and departments in localStorage on app start
  // useEffect(() => {
  //   const DEMO_USERS = [
  //     {
  //       id: 1,
  //       name: 'Super Admin',
  //       role: 'admin',
  //       department: 'Administration',
  //       email: 'superadmin@hrmconnect.com',
  //       username: 'superadmin',
  //       password: 'superadmin123'
  //     }
  //     ,
  //     {
  //       id: 2,
  //       name: 'Manager One',
  //       role: 'manager',
  //       department: 'Administration',
  //       email: 'manager1@hrmconnect.com',
  //       username: 'manager1',
  //       password: 'manager123'
  //     },
  //     {
  //       id: 3,
  //       name: 'Employee One',
  //       role: 'employee',
  //       department: 'Administration',
  //       email: 'employee1@hrmconnect.com',
  //       username: 'employee1',
  //       password: 'emp123'
  //     }
  //   ];

  //   const storedEmployees = localStorage.getItem('employees');
  //   if (!storedEmployees) {
  //     localStorage.setItem('employees', JSON.stringify(DEMO_USERS));
  //   } else {
  //     // Ensure demo users are present
  //     let empData = JSON.parse(storedEmployees);
  //     DEMO_USERS.forEach(demoUser => {
  //       if (!empData.find(emp => emp.username === demoUser.username && emp.password === demoUser.password)) {
  //         empData.push(demoUser);
  //       }
  //     });
  //     localStorage.setItem('employees', JSON.stringify(empData));
  //   }

  //   const storedDepartments = localStorage.getItem('departments');
  //   if (!storedDepartments) {
  //     const defaultDept = {
  //       id: 1,
  //       name: 'Administration',
  //       description: 'Administrative department'
  //     };
  //     localStorage.setItem('departments', JSON.stringify([defaultDept]));
  //   }
  // }, []);

  const handleLogin = (role, userData) => { setUser({ ...userData, role }); };

  const handleLogout = () => { setUser(null); };

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
                  <Route path="/admin" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
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
