const { v4: uuidv4 } = require('uuid'); // Ensure this is at the top
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const routes = require('./routes/index');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
// const redis = new Redis("redis://localhost:6379");

const connectToDB = require('./configs/conn');
const { getRandomQuestions } = require('./data/RandomSequences');

dotenv.config();
require('./configs/passport');
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://hectoclash-1.onrender.com"],
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'none'
  }
}));

const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins or specify your frontend URL
    methods: ['GET', 'POST'],
  },
});

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const rooms = {}; // Stores room data
const sequences = [
  ["2", "4", "9", "3", "8", "4"],
  ["5", "1", "7", "3", "6", "2"],
  ["8", "3", "6", "4", "9", "7"],
]; // Add more sequences as needed
const GAME_TIME = 1200; // Total game time in seconds
const randomJoiners=[];
// Add function to emit rooms update to all spectators
function emitRoomsUpdate() {
  const activeRooms = Object.entries(rooms).map(([roomId, room]) => ({
    roomId,
    players: room.players,
    timer: room.timer,
    gameStarted: room.gameStarted
  }));
  io.emit("roomsUpdate", { rooms: activeRooms });
} 

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);




  
  const LOCK_KEY = "matchmaking-lock";
  const LOCK_TTL = 3000; // 3 seconds
  
  socket.on('joinMatchRoom', async ({ playerId }) => {
    console.log(`${playerId} is trying to join a match`);
  
    try {
      // const lockToken = uuidv4(); 
      // A unique value for our lock attempt
  
      // Try to acquire the lock
      // const acquired = await redis.set(LOCK_KEY, lockToken, 'PX', LOCK_TTL, 'NX');
      // if (!acquired) {
      //   console.log("Matchmaking in progress. Please try again.");
      //   socket.emit("matchmakingPending");
      //   return;
      // }
  
      // Critical section begins
      if (randomJoiners.length > 0) {
        const opponent = randomJoiners.shift();
        const roomId = uuidv4();
  
        rooms[roomId] = {
          players: [],
          timer: 120,
          duelTime: GAME_TIME,
          gameStarted: false,
          roomId: roomId,
        };
  
        [opponent, { socket, playerId }].forEach(({ socket, playerId }) => {
          rooms[roomId].players.push({
            id: socket.id,
            playerId,
            score: 0,
            sequenceIndex: 0,
            ready: false,
            currentExpression: "",
          });
  
          socket.join(roomId);
          socket.emit('joinedMatchRoom', { roomId });
        });
  
        console.log(`Room ${roomId} created for ${opponent.playerId} and ${playerId}`);
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
        emitRoomsUpdate();
      } else {
        randomJoiners.push({ socket, playerId });
        console.log(`${playerId} is waiting for an opponent`);
      }
  
      // Critical section ends
      // Release the lock
      // const currentLockValue = await redis.get(LOCK_KEY);
      // if (currentLockValue === lockToken) {
      //   await redis.del(LOCK_KEY);
      // }
  
    } catch (error) {
      console.error("Error in matchmaking:", error);
    }
  });
  
  
  socket.on("leftRoom", ({ roomId, playerId }) => {
    const room = rooms[roomId];
  
    if (!room) return;
  
    const leavingPlayer = room.players.find((p) => p.playerId === playerId);
  
    if (leavingPlayer) {
      const socketIdToExclude = leavingPlayer.id;
  
      io.to(roomId).except(socketIdToExclude).emit("message", {
        message: "Opponent left the Game!",
      });
    }
  
    room.players = room.players.filter((p) => p.playerId !== playerId);
  });
  

  // Add handler for spectator connection
  socket.on("spectatorJoin", () => {
    console.log(`Spectator joined: ${socket.id}`);
    emitRoomsUpdate();
  });

  socket.on("joinRoom", ({ roomId, playerId,gameTime }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], timer: gameTime,duelTime:GAME_TIME, gameStarted: false,roomId:roomId };
    }

    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push({
        id: socket.id,
        playerId: playerId,
        score: 0,
        sequenceIndex: 0,
        ready: false,
        currentExpression: "" // Initialize the current expression field
      });

      socket.join(roomId);
      console.log(`${playerId} joined room: ${roomId}`);

      io.to(roomId).emit("roomUpdate", rooms[roomId]);
      emitRoomsUpdate(); // Emit update to spectators
    } else {
      socket.emit("roomFull", { message: "Room is full!" });
    }
  });

  // Listen for mathExpression events
  socket.on("mathExpression", ({ expression, playerId,roomId }) => {
    // Find which room this player is in
    console.log('rr',roomId);
    if(!roomId)return;
    const player = rooms[roomId].players.find(p => p.playerId === playerId);
    // console.log(roomId,player);
      if (player) {
        // Update the player's current expression
        player.currentExpression = expression;
        console.log(player);
        // Also update the general room state for spectators
        emitRoomsUpdate();
      }
  });

  // When a player is ready
  socket.on("playerReady", ({ roomId, playerId }) => {
    console.log(roomId,playerId);
    if (rooms[roomId]) {
      const player = rooms[roomId].players.find((p) => p.playerId === playerId);
      if (player) {
        player.ready = true;

        // If both players are ready, emit `bothPlayersReady`
        if (rooms[roomId].players.length === 2 && rooms[roomId].players.every(p => p.ready)) {
          io.to(roomId).emit("bothPlayersReady", { message: "Both players are ready. Start the game!",roomId });
        }
      }
    }
  });

  // Start game when frontend emits "startGame"
  socket.on("startGame", ({ roomId }) => {
    if (rooms[roomId] && rooms[roomId].players.length === 2 && !rooms[roomId].gameStarted) {
      console.log(`Game started in room: ${roomId}`);
      
      rooms[roomId].gameStarted = true;
      startGameTimer(roomId);
  
      // Generate dynamic sequences for this game session
      const sequencesPerPlayer = getRandomQuestions(10); // You can adjust the count
  
      // Store the sequences inside room for consistent access
      rooms[roomId].sequences = sequencesPerPlayer;
  
      // Send the first sequence to each player
      rooms[roomId].players.forEach((player) => {
        const initialSequence = sequencesPerPlayer[player.sequenceIndex];
        io.to(player.id).emit("GameStarted", {
          message: "Game Starting!",
          sequence: initialSequence,
        });
      });
    }
  });
  

  socket.on("updateScore", ({ roomId, score }) => {
    if (rooms[roomId]) {
      const player = rooms[roomId].players.find((p) => p.id === socket.id);
      if (player) {
        player.score = score;
        player.sequenceIndex += 1;
        player.currentExpression = ""; // Reset current expression when moving to next sequence

        io.to(roomId).emit("latestScore", { players: rooms[roomId].players });
        emitRoomsUpdate(); // Emit update to spectators

        // Check if there's a next sequence
        if (player.sequenceIndex < rooms[roomId].sequences.length) {
          const nextSequence = rooms[roomId].sequences[player.sequenceIndex];
          io.to(socket.id).emit("nextSequence", { sequence: nextSequence });
        } else {
          io.to(socket.id).emit("gameOver", { message: "No more sequences!", room: rooms[roomId] });
        }
        
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    for (const roomId in rooms) {
      const playerIndex = rooms[roomId].players.findIndex(
        (player) => player.id === socket.id
      );
      if (playerIndex !== -1) {
        const playerId = rooms[roomId].players[playerIndex].playerId;
        rooms[roomId].players.splice(playerIndex, 1);
        console.log(`${playerId} left room: ${roomId}`);

        io.to(roomId).emit("roomUpdate", rooms[roomId]);

        // Delete room if no players left
        if (rooms[roomId].players.length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});

// Function to start the room timer
function startGameTimer(roomId) {
  const interval = setInterval(() => {
    if (!rooms[roomId]) {
      clearInterval(interval);
      return;
    }

    rooms[roomId].timer -= 1;
    // console.log(roomId,rooms[roomId].timer );
    io.to(roomId).emit("timerUpdate", { timer: rooms[roomId].timer });

    // End the game when the timer reaches 0
    if (rooms[roomId].timer <= 0) {
      clearInterval(interval);
      io.to(roomId).emit("gameOver", { message: "Time's up!",room:rooms[roomId] });
      delete rooms[roomId]; // Clean up the room data
    }
    emitRoomsUpdate();
  }, 1000); // Update every second
}

server.listen(PORT, () => {
  connectToDB();
  console.log(`Server running at port ${PORT}`);
});

app.get('/', () => {
  console.log("Welcome");
});
