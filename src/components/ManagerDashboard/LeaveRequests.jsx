import React from 'react';
import LeaveList from './LeaveList';

function LeaveRequests({ leaves, employees, teamMembers, updateLeaveStatus }) {
  return (
    <div>
      <h5 className="mb-3">Leave Requests</h5>
      <div className="card">
        <div className="card-body">
          <LeaveList leaves={leaves} employees={employees} teamMembers={teamMembers} updateLeaveStatus={updateLeaveStatus} />
        </div>
      </div>
    </div>
  );
}

export default LeaveRequests;
