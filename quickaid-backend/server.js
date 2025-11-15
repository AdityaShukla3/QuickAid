// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const Hospital = require('./models/hospitalModel'); // <-- added

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('🚑 QuickAid Backend Running');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const aiRoutes = require('./routes/aiRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes'); // if you added routes

app.use('/api/auth', authRoutes);
app.use('/api/alert', alertRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/hospitals', hospitalRoutes); // optional: mount hospital routes

// Server + Socket.io Setup
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Make IO global so controllers can use global.io.emit(...) if needed
global.io = io;

io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // When a new SOS arrives from frontend
  socket.on('new-alert', async (alert) => {
    try {
      console.log('🚨 New alert received:', alert);

      // 1) Broadcast to all responders / dashboards
      io.emit('alert-broadcast', alert);

      // 2) Try to find the nearest VERIFIED hospital (within 8 km)
      if (alert && alert.location && alert.location.lat != null && alert.location.lng != null) {
        const lat = parseFloat(alert.location.lat);
        const lng = parseFloat(alert.location.lng);

        try {
          const nearest = await Hospital.findOne({
            verified: true,
            location: {
              $near: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $maxDistance: 8000 // meters, adjust as needed
              }
            }
          }).select('-__v');

          if (nearest) {
            // Notify the assigned hospital (broadcast or targeted emit)
            // If you want to notify specific hospital socket(s) you'd need to map hospital id -> socket id(s).
            io.emit('hospital-notify', {
              message: 'New emergency nearby',
              assignedHospital: {
                id: nearest._id,
                name: nearest.name,
                contact: nearest.contact,
                location: nearest.location,
                bedsAvailable: nearest.bedsAvailable,
                services: nearest.services
              },
              alert
            });

            console.log('🏥 Assigned nearest hospital:', nearest.name);
          } else {
            console.log('⚠️ No verified hospital found within range.');
            io.emit('hospital-notify', {
              message: 'No nearby verified hospital found',
              assignedHospital: null,
              alert
            });
          }
        } catch (dbErr) {
          console.error('DB error while finding nearest hospital:', dbErr);
          // still notify responders, but mention hospital assignment failed
          io.emit('hospital-notify', {
            message: 'Hospital assignment failed',
            error: dbErr.message,
            assignedHospital: null,
            alert
          });
        }
      } else {
        console.log('⚠️ Alert missing location data, skipping hospital search.');
      }
    } catch (err) {
      console.error('Error handling new-alert:', err);
    }
  });

  // When a responder/hospital accepts an alert
  socket.on('accept-alert', (data) => {
    try {
      console.log('✅ Alert accepted:', data);
      // Broadcast acceptance so victim UI / other responders can update
      io.emit('alert-accepted', data);
    } catch (err) {
      console.error('Error on accept-alert:', err);
    }
  });

  // Optional: hospital can update beds / status via sockets
  socket.on('hospital-update', (payload) => {
    // Example payload: { hospitalId, bedsAvailable, note }
    io.emit('hospital-update-broadcast', payload);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
