const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.post('/host-sync', (req, res) => {
  const { roomId, action, timestamp, videoId } = req.body;
  
  io.to(roomId).emit('viewer-sync', { action, timestamp, videoId });
  
  console.log(`Streamer: ${action} a ${timestamp} sul video ${videoId}`);
  res.sendStatus(200);
});

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, role, nickname }) => {
    socket.join(roomId);
    console.log(`${nickname || role} si è unito alla stanza: ${roomId}`);
  });
});

// MODIFICA PER IL CLOUD: Usiamo la porta dinamica di Glitch
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server online sulla porta ${PORT}`));
