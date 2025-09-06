import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Login attempt:', { username, password });

    // Fetch employees from localStorage
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const user = employees.find(emp => emp.username === username && emp.password === password);

    if (user) {
      console.log('Login successful for user:', user);
      onLogin(user.role, user);
    } else {
      console.log('Login failed: Invalid username or password');
      alert('Invalid credentials. Please check your username and password.');
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
                <p className="mb-1"><strong>Super Admin:</strong> superadmin / superadmin123</p>
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