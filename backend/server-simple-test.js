import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Login route
app.post('/api/auth/login', (req, res) => {
  console.log('Login request body:', req.body);
  
  const { email, password } = req.body;
  
  // Simple test authentication
  if (email === 'admin@smartseason.com' && password === 'password123') {
    res.json({
      token: 'test-token-123',
      user: {
        id: 1,
        email: 'admin@smartseason.com',
        name: 'Admin User',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log('Test credentials: admin@smartseason.com / password123');
});
