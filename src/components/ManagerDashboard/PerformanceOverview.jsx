import React from 'react';
import TeamMemberList from './TeamMemberList';

function PerformanceOverview({ teamMembers, openPerformanceModal }) {
  return (
    <>
      <div className="row mb-4">
        <div className="col-md-12 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className="text-info">Team Performance Overview</h3>
              <p className="text-muted">Monitor and analyze team performance</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Performance Metrics</h5>
          <small className="text-muted">Track individual and team performance</small>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {teamMembers.map((member) => (
              <li key={member.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div
                    className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '45px', height: '45px', color: 'white', fontWeight: 'bold' }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="fw-bold">{member.name}</div>
                    <small className="text-muted">{member.department}</small>
                  </div>
                </div>
                <div>
                  <span
                    className={`badge ${
                      member.performance === "Excellent" ? "bg-success" :
                      member.performance === "Average" ? "bg-warning" : "bg-secondary"
                    } me-2`}
                  >
                    {member.performance || 'N/A'}
                  </span>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => openPerformanceModal(member)}>
                    Set Performance
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default PerformanceOverview;
