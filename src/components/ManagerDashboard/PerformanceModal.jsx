import React from 'react';

function PerformanceModal({ showPerformanceModal, closePerformanceModal, performanceLevel, setPerformanceLevel, savePerformance }) {
  return (
    <>
      <div className={`modal ${showPerformanceModal ? 'show' : ''}`} style={{ display: showPerformanceModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Set Performance Level</h5>
              <button type="button" className="btn-close" onClick={closePerformanceModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Performance Level</label>
                  <select
                    className="form-select"
                    value={performanceLevel}
                    onChange={(e) => setPerformanceLevel(e.target.value)}
                  >
                    <option value="">Select Level</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closePerformanceModal}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={savePerformance}>Save</button>
            </div>
          </div>
        </div>
      </div>
      {showPerformanceModal && <div className="modal-backdrop show"></div>}
    </>
  );
}

export default PerformanceModal;
