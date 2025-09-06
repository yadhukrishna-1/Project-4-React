import React from 'react';
import { Card, Row, Col, Badge, ListGroup } from 'react-bootstrap';

function EmployeeDashboard() {
  // Sample data - in a real app, this would come from an API
  const user = {
    name: "Mike Developer",
    email: "mike@company.com",
    department: "Engineering",
    role: "employee",
    manager: "Sarah Manager",
    performance: "Excellent",
    joinDate: "2024-03-01"
  };

  const tasks = [
    {
      title: "Complete User Authentication Module",
      description: "Implement secure user login system",
      dueDate: "2024-08-30",
      status: "In Progress"
    }
  ];

  const taskSummary = {
    total: 1,
    completed: 0,
    inProgress: 1,
    pending: 0
  };



  return (
    <div>
      <h2 className="mb-4">Employee Dashboard</h2>
      <p className="lead">Welcome back, {user.name}</p>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">My Tasks</h5>
              <small className="text-muted">Tasks assigned to you</small>
            </Card.Header>
            <Card.Body>
              {tasks.map((task, index) => (
                <div key={index} className="border-start border-4 border-primary ps-3 mb-3">
                  <h6>{task.title}</h6>
                  <p className="text-muted mb-1">{task.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Due: {task.dueDate}</small>
                    <Badge bg={task.status === "In Progress" ? "warning" : "success"}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">My Profile</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{width: '60px', height: '60px', color: 'white', fontWeight: 'bold', fontSize: '1.5rem'}}>
                  MD
                </div>
                <h5 className="mt-2 mb-0">{user.name}</h5>
                <p className="text-muted">{user.email}</p>
              </div>
              
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Department:</span>
                  <span className="fw-bold">{user.department}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Role:</span>
                  <span className="fw-bold">{user.role}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Manager:</span>
                  <span className="fw-bold">{user.manager}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Performance:</span>
                  <Badge bg={user.performance === "Excellent" ? "success" : "warning"}>
                    {user.performance}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Join Date:</span>
                  <span className="fw-bold">{user.joinDate}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Task Summary</h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col xs={3}>
                  <div className="border rounded p-2">
                    <h4 className="mb-0 text-primary">{taskSummary.total}</h4>
                    <small>Total</small>
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="border rounded p-2">
                    <h4 className="mb-0 text-success">{taskSummary.completed}</h4>
                    <small>Done</small>
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="border rounded p-2">
                    <h4 className="mb-0 text-warning">{taskSummary.inProgress}</h4>
                    <small>Active</small>
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="border rounded p-2">
                    <h4 className="mb-0 text-secondary">{taskSummary.pending}</h4>
                    <small>Pending</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>


        </Col>
      </Row>


    </div>
  );
}

// Make sure to export as default
export default EmployeeDashboard;