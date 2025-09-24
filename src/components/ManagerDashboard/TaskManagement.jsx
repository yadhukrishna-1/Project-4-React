import React from 'react';
import StatsCards from './StatsCards';
import TaskList from './TaskList';

function TaskManagement({ completedTasks, activeTasks, teamTasks, tasks, setTasks, updateTaskStatus, openTaskModal, clearTasks }) {
  const stats = [
    { value: completedTasks, label: 'Completed Tasks', color: 'text-success' },
    { value: activeTasks, label: 'Active Tasks', color: 'text-warning' }
  ];

  return (
    <>
      <StatsCards stats={stats} />
      <TaskList teamTasks={teamTasks} tasks={tasks} setTasks={setTasks} updateTaskStatus={updateTaskStatus} openTaskModal={openTaskModal} />
      <button onClick={clearTasks} className='btn btn-danger float-end'>Clear All Tasks</button>
    </>
  );
}

export default TaskManagement;
