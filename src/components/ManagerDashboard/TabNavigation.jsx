import React from 'react';

function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'myTeam' ? 'active' : ''}`}
          onClick={() => setActiveTab('myTeam')}
        >
          My Team
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'task' ? 'active' : ''}`}
          onClick={() => setActiveTab('task')}
        >
          Task
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          Leaves
        </button>
      </li>
    </ul>
  );
}

export default TabNavigation;
