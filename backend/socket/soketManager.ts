import { Server, Socket } from 'socket.io';
import { handleMessage } from './messageHandler';
import { handleVote } from './voteHandler';

export function setupSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('새로운 클라이언트 연결됨');

        // 연결이 끊어졌을 때
        socket.on('disconnect', () => {
            console.log('클라이언트 연결 끊김');
        });

        // 에러 발생 시
        socket.on('error', (error) => {
            console.error('소켓 에러:', error);
        });

        // handler 등록
        handleMessage(io, socket);
        handleVote(io, socket);
    });
}