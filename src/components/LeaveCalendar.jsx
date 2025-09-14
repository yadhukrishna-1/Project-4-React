import React, { useState, useEffect } from "react";

function LeaveCalendar({ user }) {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    const storedLeaves = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    setLeaveRequests(storedLeaves);
  }, []);

  const saveLeaves = (updated) => {
    setLeaveRequests(updated);
    localStorage.setItem("leaveRequests", JSON.stringify(updated));
  };

  const submitLeaveRequest = () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      alert("Please fill all fields.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      employeeId: user.id,
      employeeName: user.name,
      department: user.department,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      reason: newLeave.reason,
      managerApproval: "pending",
      hrApproval: "pending",
    };

    const updated = [...leaveRequests, newRequest];
    saveLeaves(updated);

    setNewLeave({ startDate: "", endDate: "", reason: "" });
    alert("Leave request submitted!");
  };

  return (
    <div>
      <h3>Leave Calendar</h3>

      {user.role === "employee" && (
        <div className="mb-4">
          <h5>Request Leave</h5>
          <input
            type="date"
            className="form-control mb-2"
            value={newLeave.startDate}
            onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
          />
          <input
            type="date"
            className="form-control mb-2"
            value={newLeave.endDate}
            onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Reason"
            value={newLeave.reason}
            onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
          ></textarea>
          <button className="btn btn-primary" onClick={submitLeaveRequest}>
            Submit Leave Request
          </button>
        </div>
      )}

      <h5>My Leave Requests</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Dates</th>
            <th>Reason</th>
            <th>Manager</th>
            <th>HR</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests
            .filter((leave) => leave.employeeId === user.id)
            .map((leave) => (
              <tr key={leave.id}>
                <td>{leave.startDate} to {leave.endDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.managerApproval}</td>
                <td>{leave.hrApproval}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveCalendar;
