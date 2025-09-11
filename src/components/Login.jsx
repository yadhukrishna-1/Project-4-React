import React, { useState } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Login attempt:', { username, password });

    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const user = employees.find(
      (emp) => emp.username === username && emp.password === password
    );

    if (user) {
      console.log('Login successful for user:', user);
      // Store logged-in user in localStorage for dashboard access
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      onLogin(user);
    } else {
      console.log('Login failed: Invalid username or password');
      alert('Invalid credentials. Please check your username and password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box shadow-lg">
        {/* Left side */}
        <div className="login-left">
          <img src="img-3.png" alt="HRM Logo" className="logo blue-icon" />
          {/* D:\programs\PROJECTS\3rd-(React)\HRM-Connect\public\img-3.png           */}
          <h2>HRM-CONNECT</h2>
          <p>Streamlining HR operations with ease and efficiency.</p>
        </div>

        {/* Right side */}
        <div className="login-right">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <input type="checkbox" id="remember" />{' '}
                <label htmlFor="remember" className="small">
                  Remember me
                </label>
              </div>
              {/* <a href="#" className="small text-light">
                Recover password
              </a> */}
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Sign In
            </button>
          </form>

          <div className="mt-3 p-3 bg-light rounded text-dark">
            <h6 className="fw-bold text-primary mb-2">Terms & Conditions</h6>
            <ul className="small mb-0">
              <li>Use this system responsibly and for authorized purposes only.</li>
              <li>Keep your login credentials confidential and secure.</li>
              <li>Comply with company policies regarding HR data and privacy.</li>
              <li>Activity may be monitored for security purposes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
