const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('🚑 Are chala ki nhiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/alert', alertRoutes);
app.use('/api/ai', aiRoutes);

// Server + Socket.io Setup
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Make IO global
global.io = io;

io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // Listen for SOS alert
  socket.on('new-alert', (data) => {
    console.log('🚨 New alert received:', data);
    io.emit('alert-broadcast', data);  // broadcast to responders
  });

  socket.on('accept-alert', (data) => {
    io.emit('alert-accepted', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
