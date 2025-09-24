import React from 'react';
import StatsCards from './StatsCards';
import TeamMemberList from './TeamMemberList';

function MyTeam({ teamMembers, completedTasks, activeTasks, openPerformanceModal }) {
  const stats = [
    { value: teamMembers.length, label: 'Team Members', color: 'text-primary' },
    { value: completedTasks, label: 'Completed Tasks', color: 'text-success' },
    { value: activeTasks, label: 'Active Tasks', color: 'text-warning' }
  ];

  return (
    <>
      <StatsCards stats={stats} />
      <TeamMemberList teamMembers={teamMembers} openPerformanceModal={openPerformanceModal} />
    </>
  );
}

export default MyTeam;
