import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Button, Modal, Form, Tabs, Tab } from 'react-bootstrap';

function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('myTeam');

  // Sample manager data
  const managerDepartment = "Engineering"; // This would typically come from user context or API

  // Sample data
  const allTeamMembers = [
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
    },
    {
      name: "John Sales",
      email: "john@sales.com",
      department: "Sales",
      performance: "Good"
    }
  ];

  // Filter team members by manager's department
  const teamMembers = allTeamMembers.filter(member => member.department === managerDepartment);

  const taskStats = {
    completed: 15,
    active: 5,
    teamMembers: teamMembers.length
  };



  return (
    <div>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="myTeam" title="My Team">
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
                      <div className="d-flex align-items-center">
                        <Badge bg={member.performance === "Excellent" ? "success" : "warning"} className="me-2">
                          {member.performance}
                        </Badge>
                      </div>
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
                  <h3 className="text-success">{taskStats.completed}</h3>
                  <p className="text-muted">Completed Tasks</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
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
              <h5 className="mb-0">Task Management</h5>
              <small className="text-muted">View and manage tasks for your team</small>
            </Card.Header>
            <Card.Body>
              <p>Task management content will be displayed here.</p>
              {/* Add task list or management interface here */}
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
                          <small className="text-muted">{member.department}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <Badge bg={member.performance === "Excellent" ? "success" : "warning"} className="me-2">
                          {member.performance}
                        </Badge>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

// Make sure to export as default
export default ManagerDashboard;