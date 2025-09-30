import React, { useState, useEffect } from 'react';
import TabNavigation from './ManagerDashboard/TabNavigation';
import MyTeam from './ManagerDashboard/MyTeam';
import TaskManagement from './ManagerDashboard/TaskManagement';
import PerformanceOverview from './ManagerDashboard/PerformanceOverview';
import LeaveRequests from './ManagerDashboard/LeaveRequests';
import TaskModal from './ManagerDashboard/TaskModal';
import PerformanceModal from './ManagerDashboard/PerformanceModal';

function ManagerDashboard() {
  // 🔄 State management for dashboard data
  const [activeTab, setActiveTab] = useState('myTeam'); // Current active tab
  const [employees, setEmployees] = useState([]); // All employees
  const [departments, setDepartments] = useState([]); // Departments
  const [tasks, setTasks] = useState([]); // All tasks
  const [manager, setManager] = useState(null); // Logged-in manager
  const [leaves, setLeaves] = useState([]); // Leave requests

  const [showTaskModal, setShowTaskModal] = useState(false); // Modal for adding tasks
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' }); // New task form

  const [showPerformanceModal, setShowPerformanceModal] = useState(false); // Modal for performance
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee for performance
  const [performanceLevel, setPerformanceLevel] = useState(''); // Performance level

  useEffect(() => {
    // Fetch employees, departments, tasks, leaves from localStorage
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    const storedDepartments = JSON.parse(localStorage.getItem('departments')) || [];
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];

    setEmployees(storedEmployees);
    setDepartments(storedDepartments);
    setTasks(storedTasks);
    setLeaves(storedLeaves);

    // Simulate logged-in manager from localStorage or context
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.role === 'manager') {
      setManager(loggedInUser);
    }
  }, []);

  // Filter employees by manager's department
  const teamMembers = employees.filter(emp => emp.department === (manager ? manager.department : '') && emp.role === 'employee');

  // Filter tasks assigned to team members
  const teamTasks = tasks.filter(task => teamMembers.some(member => member.id === Number(task.assignedTo)));

  // Calculate task stats
  const completedTasks = teamTasks.filter(task => task.status === 'completed').length;
  const activeTasks = teamTasks.filter(task => task.status === 'active').length;

  // Handle task modal open
  const openTaskModal = () => {
    setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
    setShowTaskModal(true);
  };

  // Handle task modal close
  const closeTaskModal = () => {
    setShowTaskModal(false);
  };

  const clearTasks = () => {
    localStorage.setItem('tasks', JSON.stringify([]));
    setTasks([]); // Clear tasks in state too
    alert('All tasks cleared!');
  };

  const clearLeaves = () => {
    if (window.confirm('Are you sure you want to clear leave history for your team? This action cannot be undone.')) {
      const allLeaves = JSON.parse(localStorage.getItem('leaves')) || [];
      const updatedLeaves = allLeaves.filter(leave => !teamMembers.some(member => member.id === leave.employeeId));
      localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
      setLeaves(updatedLeaves);
      alert('Leave history cleared for your team!');
    }
  };

  // Handle new task input change
  const handleTaskChange = (field, value) => {
    setNewTask({ ...newTask, [field]: value });
  };

  // Save new task
  const saveTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      alert('Please provide task title and assignee.');
      return;
    }
    const taskToSave = {
      ...newTask,
      id: Date.now(),
      assignedBy: manager.id,
      status: 'active',
      assignedTo: Number(newTask.assignedTo) // Ensure assignedTo is a number
    };
    const updatedTasks = [...tasks, taskToSave];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setShowTaskModal(false);
  };

  // Handle performance modal open
  const openPerformanceModal = (employee) => {
    setSelectedEmployee(employee);
    setPerformanceLevel(employee.performance || '');
    setShowPerformanceModal(true);
  };

  // Handle performance modal close
  const closePerformanceModal = () => {
    setShowPerformanceModal(false);
    setSelectedEmployee(null);
    setPerformanceLevel('');
  };

  // Update performance level
  const savePerformance = () => {
    if (!selectedEmployee) return;
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return { ...emp, performance: performanceLevel };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    closePerformanceModal();
  };

  // Update leave request status
  const updateLeaveStatus = (leaveId, status) => {
    const updatedLeaves = leaves.map(leave =>
      leave.id === leaveId ? { ...leave, managerStatus: status } : leave
    );
    setLeaves(updatedLeaves);
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
  };

  // Update task status
  const updateTaskStatus = (taskId, status) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'myTeam' && (
        <MyTeam
          teamMembers={teamMembers}
          completedTasks={completedTasks}
          activeTasks={activeTasks}
          openPerformanceModal={openPerformanceModal}
        />
      )}

      {activeTab === 'task' && (
        <TaskManagement
          completedTasks={completedTasks}
          activeTasks={activeTasks}
          teamTasks={teamTasks}
          tasks={tasks}
          setTasks={setTasks}
          updateTaskStatus={updateTaskStatus}
          openTaskModal={openTaskModal}
          clearTasks={clearTasks}
        />
      )}

      {activeTab === 'performance' && (
        <PerformanceOverview
          teamMembers={teamMembers}
          openPerformanceModal={openPerformanceModal}
        />
      )}

      {activeTab === 'leaves' && (
        <div>
          <LeaveRequests
            leaves={leaves}
            employees={employees}
            teamMembers={teamMembers}
            updateLeaveStatus={updateLeaveStatus}
          />
          <button
            onClick={clearLeaves}
            className="btn btn-danger mt-3"
          >
            Clear Leave History
          </button>
        </div>
      )}

      <TaskModal
        showTaskModal={showTaskModal}
        closeTaskModal={closeTaskModal}
        newTask={newTask}
        handleTaskChange={handleTaskChange}
        saveTask={saveTask}
        teamMembers={teamMembers}
      />

      <PerformanceModal
        showPerformanceModal={showPerformanceModal}
        closePerformanceModal={closePerformanceModal}
        performanceLevel={performanceLevel}
        setPerformanceLevel={setPerformanceLevel}
        savePerformance={savePerformance}
      />
    </div>
  );
}

export default ManagerDashboard;
