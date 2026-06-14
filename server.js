const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// ตั้งค่า CORS ให้รองรับ Netlify และ localhost
app.use(cors({
    origin: [
        "https://richroll-frontend.netlify.app",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

const server = http.createServer(app);

// ตั้งค่า Socket.io พร้อม CORS
const io = new Server(server, {
    cors: {
        origin: [
            "https://richroll-frontend.netlify.app",
            "http://localhost:5173"
        ],
        methods: ["GET", "POST"]
    }
});

const rooms = {};

console.log("--- เซิร์ฟเวอร์ Bankroll กำลังทำงาน ---");

io.on('connection', (socket) => {
    console.log(`มีผู้เล่นเชื่อมต่อเข้ามา: ${socket.id}`);

    // ระบบจัดการห้อง (Create/Join) จะทำงานต่อจากนี้
    socket.on('disconnect', () => {
        console.log(`ผู้เล่นหลุด: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์รันที่พอร์ต ${PORT} สำเร็จแล้ว`);
});