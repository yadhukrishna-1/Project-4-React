import React from 'react';

function StatsCards({ stats }) {
  return (
    <div className="row mb-4">
      {stats.map((stat, index) => (
        <div key={index} className="col-md-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className={stat.color}>{stat.value}</h3>
              <p className="text-muted">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
