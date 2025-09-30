import React from 'react';

function LeaveRequests({ leaves, employees, updateLeaveStatus }) {
  return (
    <div>
      <h5>Leave Requests</h5>
      {leaves.filter(leave => !leave.cancelled).length === 0 ? <p>No leave requests yet.</p> : (
        <ul className="list-group">
          {leaves.filter(leave => !leave.cancelled).map(leave => {
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
  );
}

export default LeaveRequests;
