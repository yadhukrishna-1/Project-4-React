import React from 'react';

function TaskModal({ showTaskModal, closeTaskModal, newTask, handleTaskChange, saveTask, teamMembers }) {
  return (
    <>
      <div className={`modal ${showTaskModal ? 'show' : ''}`} style={{ display: showTaskModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Task</h5>
              <button type="button" className="btn-close" onClick={closeTaskModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTask.title}
                    onChange={(e) => handleTaskChange('title', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => handleTaskChange('description', e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Assign To</label>
                  <select
                    className="form-select"
                    value={newTask.assignedTo}
                    onChange={(e) => handleTaskChange('assignedTo', e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newTask.dueDate}
                    onChange={(e) => handleTaskChange('dueDate', e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeTaskModal}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={saveTask}>Save Task</button>
            </div>
          </div>
        </div>
      </div>
      {showTaskModal && <div className="modal-backdrop show"></div>}
    </>
  );
}

export default TaskModal;
