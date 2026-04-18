// Test JWT secret
const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('JWT_SECRET from env:', process.env.JWT_SECRET);
console.log('JWT_SECRET type:', typeof process.env.JWT_SECRET);

if (!process.env.JWT_SECRET) {
  console.log('JWT_SECRET is not set! Using fallback...');
  process.env.JWT_SECRET = 'your-secret-key-change-this';
}

// Test JWT generation
const testToken = jwt.sign(
  { id: 1, email: 'test@test.com', name: 'Test User', role: 'agent' },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

console.log('Test token generated:', testToken.substring(0, 50) + '...');

// Test JWT verification
try {
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  console.log('JWT verification successful:', decoded.name);
} catch (error) {
  console.error('JWT verification failed:', error.message);
}
