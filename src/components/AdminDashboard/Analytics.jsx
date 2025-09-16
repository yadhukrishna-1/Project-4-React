import React from 'react';

function Analytics({ employees, departments }) {
  const admins = employees.filter(emp => emp.role === 'admin').length;
  const managers = employees.filter(emp => emp.role === 'manager').length;

  return (
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
  );
}

export default Analytics;
