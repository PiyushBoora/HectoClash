
# 🧠 HectoClash

HectoClash is a real-time multiplayer mental math game where players compete to solve Hectoc-style puzzles. It blends fast-paced gameplay with educational value, encouraging quick thinking and mental agility.

## 🚀 Live Demo

[Click here to view the live app](https://hectoclash-1.onrender.com)

## 🗂️ Project Structure

```
.
🗋 client   # React frontend
📂 server   # Backend with WebSocket, game logic, and database
```

---

## 🚀 Features

- Real-time duels with matchmaking
- Dynamic puzzle generation and difficulty sorting
- Leaderboards and post-game analytics
- Spectator mode to watch ongoing duels
- Daily and weekly challenges
- Responsive design across devices

---

## ⚙️ Tech Stack

**Frontend (client):**
- React.js
- Socket.IO Client
- Tailwind CSS

**Backend (server):**
- Node.js
- Express.js
- Socket.IO / WebSockets
- MongoDB (via Mongoose)
- REST API

---

## 💠 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/your-username/hectoClash.git
cd hectoClash
```

### Environment Variables
Create a `.env` file inside the `server` directory with the following content:

```env
MONGODB_URI
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
PORT=8080
SESSION_SECRET
JWT_KEY
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback
```

> **Note:** These credentials are for development only. Do **not** commit `.env` files or use them in production.

### Start the Client
```bash
cd client
npm install
npm run dev
```

### Start the Server
```bash
cd server
npm install
npm start
```

---

## 🧪 Testing

- Internal testing with simulated duels and live matchmaking
- Practice mode for isolated puzzle-solving
- Post-game analytics tested with all valid solutions sorted by difficulty

---

## 👨‍💻 Team

- **Arpit Markana** – Backend Developer  
- **Piyush Kumar** – Full-Stack Developer 
- **Yushae Hasmi** – Full-Stack Developer 

---

## 📄 License

MIT License
