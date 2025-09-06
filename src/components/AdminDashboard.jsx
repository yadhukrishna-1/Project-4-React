import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Badge, Tabs, Tab, Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import { getPendingRequests, updateRequestStatus } from '../utils/requests';

// Constant demo users
const DEMO_USERS = [
  {
    id: 1,
    name: 'Abhin (SP)',
    role: 'admin',
    department: 'Administration',
    email: 'superadmin@hrmconnect.com',
    username: 'superadmin',
    password: 'superadmin123'
  }
  ,
  {
    id: 2,
    name: 'Simi ES',
    role: 'manager',
    department: 'Production',
    email: 'Simi@hrmconnect.com',
    username: 'manager1',
    password: 'manager123'
  },
  {
    id: 3,
    name: 'Ramees S',
    role: 'employee',
    department: 'Production',
    email: 'Ramees@hrmconnect.com',
    username: 'employee1',
    password: 'emp123'
  }
];

const defaultDept = [
  {
    id: 1,
    name: 'Administration',
    description: 'Administrative department'
  },
  {
    id: 2,
    name: 'Production',
    description: 'Production department'
  }
];

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'employee', department: '', email: '', username: '', password: '' });
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    // localStorage.removeItem('employees');
    // localStorage.removeItem('departments');
    const storedEmployees = localStorage.getItem('employees');
    const storedDepartments = localStorage.getItem('departments');
    let empData = [];

    if (storedEmployees) {
      empData = JSON.parse(storedEmployees);
      // Ensure demo users are present
      DEMO_USERS.forEach(demoUser => {
        if (!empData.find(emp => emp.username === demoUser.username && emp.password === demoUser.password)) {
          empData.push(demoUser);
        }
      });

    } else {
      empData = [...DEMO_USERS];
    }
    localStorage.setItem('employees', JSON.stringify(empData));
    setEmployees(empData);

    if (storedDepartments) {
      setDepartments(JSON.parse(storedDepartments));
    } else {
      // Add default department

      const deptData = defaultDept;
      setDepartments(deptData);
      localStorage.setItem('departments', JSON.stringify(deptData));
    }

    
    // Load pending requests
    // const requests = getPendingRequests();
    // setPendingRequests(requests);
  }, []);


  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addEmployee = () => {
    const emp = { ...newEmployee, id: Date.now() };
    const updatedEmployees = [...employees, emp];
    setEmployees(updatedEmployees);
    saveToLocalStorage('employees', updatedEmployees);
    setNewEmployee({ name: '', role: 'employee', department: '', email: '', username: '', password: '' });
    setShowAddEmployee(false);
  };

  const addDepartment = () => {
    const dept = { ...newDepartment, id: Date.now() };
    const updatedDepartments = [...departments, dept];
    setDepartments(updatedDepartments);
    saveToLocalStorage('departments', updatedDepartments);
    setNewDepartment({ name: '', description: '' });
    setShowAddDepartment(false);
  };

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const managers = employees.filter(emp => emp.role === 'manager').length;
  const admins = employees.filter(emp => emp.role === 'admin').length;

  const handleRemoveEmployee = (emp) => {
    // Remove employee from employees list
    const updatedEmployees = employees.filter(e => e.id !== emp.id);
    setEmployees(updatedEmployees);
    saveToLocalStorage('employees', updatedEmployees);

    // Update request status to processed
    const req = pendingRequests.find(r => r.username === emp.email);
    if (req) {
      updateRequestStatus(req.id, 'processed');
      setPendingRequests(pendingRequests.filter(r => r.id !== req.id));
    }
  };

  return (
    <div>
      <Tabs defaultActiveKey="overview" id="admin-dashboard-tabs" className="mb-4">
        <Tab eventKey="overview" title="Overview">
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-primary">{totalEmployees}</h3>
                  <p className="text-muted">Total Employees</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-primary">{totalDepartments}</h3>
                  <p className="text-muted">Departments</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-primary">{admins}</h3>
                  <p className="text-muted">Admins</p>
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
                    {employees.slice(-3).map((emp) => (
                      <ListGroup.Item key={emp.id} className="d-flex align-items-center">
                        <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px', color: 'white', fontWeight: 'bold' }}>
                          {emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                  {departments.map((dept) => {
                    const empCount = employees.filter(emp => emp.department === dept.name).length;
                    return (
                      <div key={dept.id} className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">{dept.name}</span>
                          <Badge bg="primary">{empCount} employees</Badge>
                        </div>
                        <div className="progress mt-1" style={{ height: '8px' }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${totalEmployees > 0 ? (empCount / totalEmployees) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="employees" title="Employees">
          <Button variant="primary" onClick={() => setShowAddEmployee(true)} className="mb-3">Add Employee</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.department}</td>
                  <td>{emp.email}</td>
                  <td>{emp.username}</td>
                  <td>{emp.password}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="departments" title="Departments">
          <Button variant="primary" onClick={() => setShowAddDepartment(true)} className="mb-3">Add Department</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.name}</td>
                  <td>{dept.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="analytics" title="Analytics">
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header>Employee Distribution by Role</Card.Header>
                <Card.Body>
                  <p>Admins: {admins}</p>
                  <p>Managers: {managers}</p>
                  <p>Employees: {employees.filter(emp => emp.role === 'employee').length}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>Department Stats</Card.Header>
                <Card.Body>
                  {departments.map((dept) => {
                    const empCount = employees.filter(emp => emp.department === dept.name).length;
                    return <p key={dept.id}>{dept.name}: {empCount} employees</p>;
                  })}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Add Employee Modal */}
      <Modal show={showAddEmployee} onHide={() => setShowAddEmployee(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddEmployee(false)}>Close</Button>
          <Button variant="primary" onClick={addEmployee}>Add Employee</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Department Modal */}
      <Modal show={showAddDepartment} onHide={() => setShowAddDepartment(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddDepartment(false)}>Close</Button>
          <Button variant="primary" onClick={addDepartment}>Add Department</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
