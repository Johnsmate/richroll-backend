const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// 1. ตั้งค่า CORS เพื่อเชื่อมต่อกับหน้าเว็บ Netlify ได้อย่างปลอดภัย
const allowedOrigins = ["https://richroll-frontend.netlify.app", "http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

const rooms = {};

io.on('connection', (socket) => {
    console.log(`ผู้เล่นเชื่อมต่อ: ${socket.id}`);

    // ระบบสร้างห้อง พร้อมข้อมูลเมืองครบ 24 ช่อง
    socket.on('create_room', () => {
        const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
        rooms[roomId] = {
            status: 'waiting',
            turnIndex: 0,
            players: [],
            board: [
                { id: 0, name: "START", type: "special" },
                { id: 1, name: "กรุงเทพ", color: "#38bdf8", type: "city", price: 200, owner: null },
                { id: 2, name: "เชียงใหม่", color: "#38bdf8", type: "city", price: 180, owner: null },
                { id: 3, name: "โชคดี", type: "chance" },
                { id: 4, name: "ภูเก็ต", color: "#38bdf8", type: "city", price: 150, owner: null },
                { id: 5, name: "รถไฟ 1", type: "public", price: 300, owner: null },
                { id: 6, name: "คุก", type: "special" },
                { id: 7, name: "โตเกียว", color: "#a855f7", type: "city", price: 250, owner: null },
                { id: 8, name: "โอซาก้า", color: "#a855f7", type: "city", price: 220, owner: null },
                { id: 9, name: "กองทุน", type: "chest" },
                { id: 10, name: "โซล", color: "#a855f7", type: "city", price: 240, owner: null },
                { id: 11, name: "รถไฟ 2", type: "public", price: 300, owner: null },
                { id: 12, name: "ที่จอดรถ", type: "special" },
                { id: 13, name: "ลอนดอน", color: "#f97316", type: "city", price: 320, owner: null },
                { id: 14, name: "ปารีส", color: "#f97316", type: "city", price: 300, owner: null },
                { id: 15, name: "โชคดี", type: "chance" },
                { id: 16, name: "โรม", color: "#f97316", type: "city", price: 280, owner: null },
                { id: 17, name: "ประปา", type: "public", price: 150, owner: null },
                { id: 18, name: "ไปคุก", type: "special" },
                { id: 19, name: "นิวยอร์ก", color: "#10b981", type: "city", price: 400, owner: null },
                { id: 20, name: "ลอสแอนเจลิส", color: "#10b981", type: "city", price: 350, owner: null },
                { id: 21, name: "กองทุน", type: "chest" },
                { id: 22, name: "ชิคาโก", color: "#10b981", type: "city", price: 320, owner: null },
                { id: 23, name: "ไฟฟ้า", type: "public", price: 150, owner: null }
            ]
        };
        socket.emit('room_created', roomId);
    });

    // ระบบจัดการเกม (Join, Roll, Buy...) สามารถเติมฟังก์ชันต่อจากนี้ได้เลย
    socket.on('disconnect', () => console.log('ผู้เล่นออก'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server ready on port ${PORT}`));