import React from 'react';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';

function ManagerDashboard() {
  // Sample data
  const teamMembers = [
    {
      name: "Mike Developer",
      email: "mike@company.com",
      department: "Engineering",
      performance: "Excellent"
    },
    {
      name: "Yadhu",
      email: "yadhu.krishn@bulldora.com",
      department: "Engineering",
      performance: "Average"
    }
  ];

  const taskStats = {
    completed: 15,
    active: 5,
    teamMembers: teamMembers.length
  };

  return (
    <div>
      <h2 className="mb-4">Manager Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-primary">{taskStats.teamMembers}</h3>
              <p className="text-muted">Team Members</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-success">{taskStats.completed}</h3>
              <p className="text-muted">Completed Tasks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-warning">{taskStats.active}</h3>
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
            {teamMembers.map((member, index) => (
              <ListGroup.Item key={index} className="px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                         style={{width: '45px', height: '45px', color: 'white', fontWeight: 'bold'}}>
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
                  <Badge bg={member.performance === "Excellent" ? "success" : "warning"}>
                    {member.performance}
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

// Make sure to export as default
export default ManagerDashboard;