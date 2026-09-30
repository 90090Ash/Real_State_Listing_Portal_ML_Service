const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_key';
const app = express();
const server = http.createServer(app);

// Enable CORS
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    methods: ['GET', 'POST'],
  },
});

// PostgreSQL Database Connection Configuration
// ⚠️ Update password to match your local PostgreSQL setup
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'real_estate_db',
        password: 'Ashish@1234', 
        port: 5432,
      }
);

// Ensure messages table exists in PostgreSQL
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).catch((err) => console.error('Error creating table:', err));

// --- REST API ENDPOINTS ---

// 0. AUTHENTICATION ENDPOINTS
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const name = email.split('@')[0];
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, role]
    );

    const token = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(400).json({ error: 'Unauthorized role selected' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Optional Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// 1. GET Properties Endpoint (Restored)
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching properties:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. GET Chat History for a specific Property ID
app.get('/api/messages/:propertyId', async (req, res) => {
  const { propertyId } = req.params;
  try {
    const result = await pool.query(
      "SELECT sender, text, to_char(created_at, 'HH12:MI AM') as time FROM messages WHERE property_id = $1 ORDER BY id ASC",
      [propertyId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. GET All Messages across properties (Agent Dashboard)
app.get('/api/agent/messages', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.property_id, m.sender, m.text, to_char(m.created_at, 'HH12:MI AM') as time, p.title as property_title
      FROM messages m
      JOIN properties p ON m.property_id = p.id
      ORDER BY m.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching agent messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. ML Prediction Endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { sqft, bedrooms } = req.body;
    const basePrice = (sqft || 1000) * 8500 + (bedrooms || 2) * 200000;
    res.json({ success: true, predicted_price: basePrice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- AI BOT RESPONSE GENERATOR ---
function generateAiResponse(message) {
  const cleanMsg = message.toLowerCase().trim();

  // Greetings
  if (
    cleanMsg.includes('hi') ||
    cleanMsg.includes('hello') ||
    cleanMsg.includes('hey')
  ) {
    return "Hello! 👋 Welcome to Indore Real Estate Portal. How can I help you today? You can ask about property prices, EMI, or scheduling a site visit!";
  }

  // Pricing & Negotiation
  if (
    cleanMsg.includes('price') ||
    cleanMsg.includes('cost') ||
    cleanMsg.includes('rate') ||
    cleanMsg.includes('negotiable') ||
    cleanMsg.includes('discount')
  ) {
    return "Our property prices are updated in real-time. For negotiation or discount requests, our listing agent will review your inquiry shortly!";
  }

  // Site Visits & Tours
  if (
    cleanMsg.includes('visit') ||
    cleanMsg.includes('tour') ||
    cleanMsg.includes('see') ||
    cleanMsg.includes('appointment') ||
    cleanMsg.includes('timing')
  ) {
    return "We'd love to schedule a property tour! Please share your preferred date and time, and our agent will confirm it with you.";
  }

  // Loans & EMI
  if (
    cleanMsg.includes('loan') ||
    cleanMsg.includes('emi') ||
    cleanMsg.includes('mortgage') ||
    cleanMsg.includes('finance')
  ) {
    return "You can use our built-in Home Loan / Mortgage Calculator on the portal to estimate your monthly EMI at standard interest rates!";
  }

  // Default Fallback
  return "Thanks for reaching out! A real estate specialist has been notified and will reply shortly.";
}

// --- REAL-TIME SOCKET.IO EVENT HANDLING ---
io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id);

  socket.on('join_property_chat', (propertyId) => {
    socket.join(`property_${propertyId}`);
  });

  socket.on('send_message', async (data) => {
    const { propertyId, sender, text } = data;
    const roomName = `property_${propertyId}`;

    try {
      // Step A: Save user message to database
      const userMsgResult = await pool.query(
        "INSERT INTO messages (property_id, sender, text) VALUES ($1, $2, $3) RETURNING sender, text, to_char(created_at, 'HH12:MI AM') as time",
        [propertyId, sender, text]
      );
      const userMessage = userMsgResult.rows[0];
      userMessage.propertyId = propertyId;

      io.to(roomName).emit('receive_message', userMessage);

      // Step B: Trigger AI Bot reply automatically if sender is Buyer
      if (sender === 'Buyer') {
        const aiReplyText = generateAiResponse(text);

        setTimeout(async () => {
          const aiMsgResult = await pool.query(
            "INSERT INTO messages (property_id, sender, text) VALUES ($1, $2, $3) RETURNING sender, text, to_char(created_at, 'HH12:MI AM') as time",
            [propertyId, 'AI Support Bot', aiReplyText]
          );
          const aiMessage = aiMsgResult.rows[0];
          aiMessage.propertyId = propertyId;

          io.to(roomName).emit('receive_message', aiMessage);
        }, 600);
      }
    } catch (err) {
      console.error('Error handling chat message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔥 Client disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


// --- USER PANEL: Submit New Property ---
app.post('/api/properties', async (req, res) => {
  const {
    title, price, address, bedrooms, bathrooms, sqft,
    latitude, longitude, agent_name, contact_phone, contact_email
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO properties 
      (title, price, address, bedrooms, bathrooms, sqft, latitude, longitude, agent_name, contact_phone, contact_email, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Active')
      RETURNING *`,
      [
        title,
        Number(price) || 0,
        address,
        Number(bedrooms) || 2,
        Number(bathrooms) || 2,
        Number(sqft) || 1000,
        Number(latitude) || 22.7196,
        Number(longitude) || 75.8577,
        agent_name || 'Property Owner',
        contact_phone || '+91 98765 43210',
        contact_email || 'contact@nexus.ai'
      ]
    );

    res.status(201).json({ success: true, property: result.rows[0] });
  } catch (err) {
    console.error('Error inserting property:', err.message);
    res.status(500).json({ error: 'Failed to list property' });
  }
});

// --- ADMIN PANEL: Moderate / Delete Listing ---
app.delete('/api/admin/properties/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM messages WHERE property_id = $1', [id]);
    await pool.query('DELETE FROM properties WHERE id = $1', [id]);
    res.json({ success: true, message: `Property #${id} deleted successfully` });
  } catch (err) {
    console.error('Error deleting property:', err.message);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// --- ADMIN PANEL: Platform Metrics & Analytics ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    const propertyCount = await pool.query('SELECT COUNT(*) FROM properties');
    const messageCount = await pool.query('SELECT COUNT(*) FROM messages');
    const avgPrice = await pool.query('SELECT AVG(price) FROM properties');

    res.json({
      totalProperties: Number(propertyCount.rows[0].count),
      totalInquiries: Number(messageCount.rows[0].count),
      averagePrice: Math.round(Number(avgPrice.rows[0].avg) || 0)
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err.message);
    res.status(500).json({ error: 'Failed to load metrics' });
  }
});