import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple authentication logic
    if (username === 'admin' && password === 'admin123') {
      onLogin('admin', { name: 'Kelvin SuperAdmin', role: 'admin' });
    } else if (username === 'manager1' && password === 'manager123') {
      onLogin('manager', { name: 'Sarah Manager', role: 'manager' });
    } else if (username === 'employee1' && password === 'emp123') {
      onLogin('employee', { name: 'Mike Developer', role: 'employee' });
    } else {
      alert('Invalid credentials. Use demo accounts: admin/admin123, manager1/manager123, employee1/emp123');
    }
  };

  return (
    <Container fluid className="login-container vh-100 d-flex align-items-center justify-content-center ">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 text-primary">HRM-Connect</h2>
              <p className="text-center text-muted ">Sign in to access your dashboard</p>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Sign In
                </Button>
              </Form>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className='fw-bold text-warning'>demo credentials:</h6>
                <p className="mb-1"><strong>Admin:</strong> admin / admin123</p>
                <p className="mb-1"><strong>Manager:</strong> manager1 / manager123</p>
                <p className="mb-0"><strong>Employee:</strong> employee1 / emp123</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}


export default Login;