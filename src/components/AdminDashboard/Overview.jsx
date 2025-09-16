import React from 'react';

function Overview({ employees, departments }) {
  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const managers = employees.filter(emp => emp.role === 'manager').length;
  const admins = employees.filter(emp => emp.role === 'admin').length;

  return (
    <div>
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
  );
}

export default Overview;
