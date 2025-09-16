import React, { useState } from 'react';

function Departments({ departments, setDepartments, saveToLocalStorage }) {
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [editDepartment, setEditDepartment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const addDepartment = () => {
    const dept = { ...newDepartment, id: Date.now() };
    const updatedDepartments = [...departments, dept];
    setDepartments(updatedDepartments);
    saveToLocalStorage('departments', updatedDepartments);
    setNewDepartment({ name: '', description: '' });
    setShowAddDepartment(false);
  };

  const openEditDepartment = (dept) => {
    setEditDepartment(dept);
    setShowEditDepartment(true);
  };

  const handleEditDepartmentChange = (field, value) => {
    setEditDepartment({ ...editDepartment, [field]: value });
  };

  const saveEditDepartment = () => {
    const updatedDepartments = departments.map(dept => dept.id === editDepartment.id ? editDepartment : dept);
    setDepartments(updatedDepartments);
    saveToLocalStorage('departments', updatedDepartments);
    setShowEditDepartment(false);
    setEditDepartment(null);
  };

  const confirmDeleteDepartment = (dept) => {
    setDeleteTarget(dept);
    setDeleteError(''); // Reset error
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (deleteTarget.name === 'Administration') {
      setDeleteError('The Administration department cannot be deleted as it is the default for managing the website.');
      return;
    }
    const updatedDepartments = departments.filter(dept => dept.id !== deleteTarget.id);
    setDepartments(updatedDepartments);
    saveToLocalStorage('departments', updatedDepartments);
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteError('');
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteError('');
  };

  return (
    <div>
      <button className="btn btn-primary mb-3" onClick={() => setShowAddDepartment(true)}>Add Department</button>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.name}</td>
                <td>{dept.description}</td>
                <td>
                  {dept.name !== 'Administration' && (
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditDepartment(dept)}>Edit</button>
                  )}
                  {dept.name !== 'Administration' && (
                    <button className="btn btn-sm btn-danger" onClick={() => confirmDeleteDepartment(dept)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddDepartment(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddDepartment(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={addDepartment}>Add Department</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditDepartment && editDepartment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditDepartment(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editDepartment.name}
                    onChange={(e) => handleEditDepartmentChange('name', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editDepartment.description}
                    onChange={(e) => handleEditDepartmentChange('description', e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditDepartment(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={saveEditDepartment}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this department?</p>
                <p><strong>{deleteTarget?.name}</strong></p>
                {deleteError && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {deleteError}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;
