import React from 'react';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';

function AdminDashboard() {
  // Sample data - in a real app, this would come from an API
  const departments = [
    { name: 'Engineering', employees: 3 },
    { name: 'Marketing', employees: 1 },
    { name: 'HR', employees: 1 },
    { name: 'Finance', employees: 1 }
  ];

  const recentEmployees = [
    { name: 'Lisa Designer', department: 'Marketing', initials: 'LD' },
    { name: 'David Analyst', department: 'Finance', initials: 'DA' },
    { name: 'Yadhu', department: 'Engineering', initials: 'Y' }
  ];

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-primary">6</h3>
              <p className="text-muted">Total Employees</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-primary">4</h3>
              <p className="text-muted">Departments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-primary">1</h3>
              <p className="text-muted">Managers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-primary">2</h3>
              <p className="text-muted">Active Tasks</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Recent Employees</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {recentEmployees.map((emp, index) => (
                  <ListGroup.Item key={index} className="d-flex align-items-center">
                    <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                         style={{width: '40px', height: '40px', color: 'white', fontWeight: 'bold'}}>
                      {emp.initials}
                    </div>
                    <div>
                      <div className="fw-bold">{emp.name}</div>
                      <small className="text-muted">{emp.department}</small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Department Overview</h5>
            </Card.Header>
            <Card.Body>
              {departments.map((dept, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">{dept.name}</span>
                    <Badge bg="primary">{dept.employees} employees</Badge>
                  </div>
                  <div className="progress mt-1" style={{height: '8px'}}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{width: `${(dept.employees / 6) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;