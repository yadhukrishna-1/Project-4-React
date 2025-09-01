import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, userData) => { setUser({ ...userData, role }); };

  const handleLogout = () => { setUser(null); };
  
  console.log(user);

  return (
    <Router>
      <div className="App"> 
        {!user ? (<Login onLogin={handleLogin} />) :
        (
          <>
            {/* Navigation bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
              <div className="container">
                <span className="navbar-brand">HRM-Connect</span>
                <div className="navbar-nav ms-auto"> 
                  <span className="navbar-text me-3">Welcome, {user.name}</span>
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}> Logout </button>
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
          </>)}
      </div>
    </Router>);
}
export default App;