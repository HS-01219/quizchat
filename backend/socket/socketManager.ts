import { Server, Socket } from "socket.io";
import { handleUser, userLeave } from "./userHandler";
import { handleQuiz } from "./quizHandler";
import { handleMessage } from './messageHandler';
import { handleVote } from './voteHandler';
import { setRedisValue } from "../utils/redis";

export const setupSocketIO = (io : Server) => {
    io.on('connection', async (socket : Socket) => {
        console.log('새로운 클라이언트 연결됨');
        socket.data.hasJoined = false; // hasJoined 초기화
        
        const connectedSockets = await io.fetchSockets();
        const actualUserCount = connectedSockets.filter(s => s.data.hasJoined).length;

        await setRedisValue('currentUsers', actualUserCount.toString());
        console.log('서버 재시작 후 유저수 재계산 : ', actualUserCount);

        // 연결이 끊어졌을 때
        socket.on('disconnecting', () => {
            console.log('disconnecting 이벤트 발생, hasJoined:', socket.data.hasJoined);
            if(socket.data.hasJoined){ // JOIN_ROOM 요청을 보낸 유저만 퇴장 처리
                userLeave(io, socket);
            }
        });

        socket.on('disconnect', () => {
            console.log('클라이언트 연결 끊김');
            // if(socket.data.hasJoined) { 
            //     userLeave(io, socket);
            // }
        });

        // 에러 발생 시
        socket.on('error', (error) => {
            console.error('소켓 에러:', error);
        });

        // handler 등록
        handleUser(io, socket);
        handleMessage(io, socket);
        handleVote(io, socket);
        handleQuiz(io, socket);
    });
}