import { Server, Socket } from 'socket.io';

export function handleMessage(io: Server, socket: Socket) {
    socket.on('sendMessage', (msg) => {
        console.log('메시지 수신:', msg);
        io.emit('receiveMessage', msg);
    });
}