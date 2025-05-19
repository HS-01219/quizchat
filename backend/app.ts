import { Request, Response } from 'express';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin: "http://localhost:5176",
    credentials: true,
}));
app.use(express.json());

// catch 404 and forward to error handler
app.use(function(req : Request, res : Response) {
    res.status(StatusCodes.NOT_FOUND).end();
});

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors : {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"], 
        credentials: true 
    }
});

server.listen(PORT, () => {
    console.log("서버 실행")
});

io.on('connection', (socket) => {
  console.log('새로운 클라이언트 연결됨');

  // 연결이 끊어졌을 때
  socket.on('disconnect', () => {
    console.log('클라이언트 연결 끊김');
  });

  // 에러 발생 시
  socket.on('error', (error) => {
    console.error('소켓 에러:', error);
  });

  socket.on('sendMessage', (msg) => {
    console.log('메시지 수신:', msg);
    io.emit('receiveMessage', msg);
  });

  /*
    socket.emit(): 특정 소켓(연결된 특정 클라이언트)에게만 메시지 전송
    io.emit(): 연결된 모든 소켓에게 메시지 전송 (전체 공지 같은 거 할 때)
    socket.broadcast.emit(): 메시지를 보낸 자신을 제외한 모든 소켓에게 메시지 전송
    io.to('roomName').emit(): 특정 '방(room)'에 있는 소켓들에게만 메시지 전송 (채팅방 기능 구현에 필수!)
  */

  // 이제 여기서 메시지 수신 및 처리 로직 추가!
});
