import React from 'react';

function LeaveList({ leaves, employees, teamMembers, updateLeaveStatus }) {
  const teamLeaves = leaves.filter(leave =>
    teamMembers.some(member => member.id === Number(leave.employeeId)) && !leave.cancelled
  );

  if (teamLeaves.length === 0) return <p>No leave requests.</p>;

  return (
    <ul className="list-group">
      {teamLeaves.map((leave) => (
        <li key={leave.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">{employees.find(e => e.id === leave.employeeId)?.name || 'Employee'}</div>
            <small>{leave.startDate} → {leave.endDate}</small>
            <div><small>Reason: {leave.reason}</small></div>
          </div>
          <div>
            {!leave.managerStatus ? (
              <>
                <button className="btn btn-success btn-sm me-2" onClick={() => updateLeaveStatus(leave.id, 'approved')}>
                  Approve
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => updateLeaveStatus(leave.id, 'rejected')}>
                  Reject
                </button>
              </>
            ) : (
              <span className={`badge ${leave.managerStatus === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                {leave.managerStatus}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default LeaveList;
