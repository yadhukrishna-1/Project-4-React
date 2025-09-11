import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Button, Modal, Form, Tabs, Tab } from 'react-bootstrap';

function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('myTeam');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [manager, setManager] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [performanceLevel, setPerformanceLevel] = useState('');

  useEffect(() => {
    // Fetch employees, departments, tasks from localStorage
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    const storedDepartments = JSON.parse(localStorage.getItem('departments')) || [];
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    setEmployees(storedEmployees);
    setDepartments(storedDepartments);
    setTasks(storedTasks);

    // Simulate logged-in manager from localStorage or context
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.role === 'manager') {
      setManager(loggedInUser);
    }
  }, []);

  // Filter employees by manager's department
  const teamMembers = employees.filter(emp => emp.department === (manager ? manager.department : '') && emp.role === 'employee');

  // Filter tasks assigned to team members
  const teamTasks = tasks.filter(task => teamMembers.some(member => member.id === task.assignedTo));

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
      status: 'active'
    };
    const updatedTasks = [...tasks, taskToSave];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setShowTaskModal(false);
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

  return (
    <div>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="myTeam" title="My Team">
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-primary">{teamMembers.length}</h3>
                  <p className="text-muted">Team Members</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-success">{completedTasks}</h3>
                  <p className="text-muted">Completed Tasks</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-warning">{activeTasks}</h3>
                  <p className="text-muted">Active Tasks</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Team Members</h5>
              <small className="text-muted">Manage your direct reports</small>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {teamMembers.map((member) => (
                  <ListGroup.Item key={member.id} className="px-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: '45px', height: '45px', color: 'white', fontWeight: 'bold' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="fw-bold">{member.name}</div>
                        <small className="text-muted">{member.email}</small>
                        <div>
                          <small className="text-muted">{member.department}</small>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Badge bg={member.performance === "Excellent" ? "success" : member.performance === "Average" ? "warning" : "secondary"} className="me-2">
                        {member.performance || 'N/A'}
                      </Badge>
                      <Button variant="outline-primary" size="sm" onClick={() => openPerformanceModal(member)}>Set Performance</Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="task" title="Task">
          <Row className="mb-4">
            <Col md={6} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-success">{completedTasks}</h3>
                  <p className="text-muted">Completed Tasks</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-warning">{activeTasks}</h3>
                  <p className="text-muted">Active Tasks</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Task Management</h5>
              <Button variant="primary" size="sm" onClick={openTaskModal}>Add Task</Button>
            </Card.Header>
            <Card.Body>
              {teamTasks.length === 0 ? (
                <p>No tasks assigned yet.</p>
              ) : (
                <ListGroup>
                  {teamTasks.map(task => (
                    <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{task.title}</div>
                        <small className="text-muted">{task.description}</small>
                        <div>
                          <small className="text-muted">Due: {task.dueDate || 'N/A'}</small>
                        </div>
                      </div>
                      <div>
                        <Badge bg={task.status === 'completed' ? 'success' : 'warning'} className="me-2">
                          {task.status}
                        </Badge>
                        {task.status === 'active' && (
                          <Button size="sm" variant="outline-success" onClick={() => {
                            const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t);
                            setTasks(updatedTasks);
                            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                          }}>Mark Complete</Button>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="performance" title="Performance">
          <Row className="mb-4">
            <Col md={12} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-info">Team Performance Overview</h3>
                  <p className="text-muted">Monitor and analyze team performance</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Performance Metrics</h5>
              <small className="text-muted">Track individual and team performance</small>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {teamMembers.map((member) => (
                  <ListGroup.Item key={member.id} className="px-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: '45px', height: '45px', color: 'white', fontWeight: 'bold' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="fw-bold">{member.name}</div>
                        <small className="text-muted">{member.department}</small>
                      </div>
                    </div>
                    <div>
                      <Badge bg={member.performance === "Excellent" ? "success" : member.performance === "Average" ? "warning" : "secondary"} className="me-2">
                        {member.performance || 'N/A'}
                      </Badge>
                      <Button variant="outline-primary" size="sm" onClick={() => openPerformanceModal(member)}>Set Performance</Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Task Modal */}
      <Modal show={showTaskModal} onHide={closeTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="taskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) => handleTaskChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTask.description}
                onChange={(e) => handleTaskChange('description', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskAssignee">
              <Form.Label>Assign To</Form.Label>
              <Form.Select
                value={newTask.assignedTo}
                onChange={(e) => handleTaskChange('assignedTo', e.target.value)}
              >
                <option value="">Select Employee</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTask.dueDate}
                onChange={(e) => handleTaskChange('dueDate', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTaskModal}>Cancel</Button>
          <Button variant="primary" onClick={saveTask}>Save Task</Button>
        </Modal.Footer>
      </Modal>

      {/* Performance Modal */}
      <Modal show={showPerformanceModal} onHide={closePerformanceModal}>
        <Modal.Header closeButton>
          <Modal.Title>Set Performance Level</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="performanceLevel">
              <Form.Label>Performance Level</Form.Label>
              <Form.Select
                value={performanceLevel}
                onChange={(e) => setPerformanceLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                <option value="Excellent">Excellent</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePerformanceModal}>Cancel</Button>
          <Button variant="primary" onClick={savePerformance}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// Make sure to export as default
export default ManagerDashboard;
