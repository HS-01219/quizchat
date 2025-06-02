import pool from '../db/mariadb';
import { ResultSetHeader } from 'mysql2/promise';
import { Server, Socket } from 'socket.io';
import type { MessagePayload } from '../../common/types';

const saveSendMessageToDB = async (roomId: number, userId: number, content: string): Promise<ResultSetHeader | null> => {
    const query = 'INSERT INTO messages (room_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())';
    const values = [roomId, userId, content];

    const connection = await pool.getConnection();
    try{
        const [results] = await connection.query<ResultSetHeader>(query, values);
        console.log('DB : 메시지 저장 성공', results);
        return results;
    }catch(err){
        console.error('DB 오류 : 메시지 저장 실패', err);
        throw err;
    }finally{
        if(connection) connection.release();
    }
};

export function handleMessage(io: Server, socket: Socket) {
    socket.on('SEND_MESSAGE', async (msg: string) => {
        const roomId = 1;
        const userId = 1;
        const nickName = "tester";

        const sendMessage: MessagePayload = {
            userId: userId,
            nickName: nickName,
            content: msg,
            timestamp: new Date().toISOString()
        };

        console.log('메시지 수신:', sendMessage);

        try{
            const DBResult = await saveSendMessageToDB(roomId, userId, msg);
            
            if(DBResult && DBResult.affectedRows > 0){
                console.log('DB : 메시지 저장 성공');
            }else{
                console.warn('DB : 메시지 저장 실패');
            }

            // io.emit('RECEIVE_MESSAGE', sendMessage);
            socket.broadcast.emit('RECEIVE_MESSAGE', sendMessage); // 다른 클라이언트에게만 전송
        }catch(err){
            console.error('DB : 메시지 처리 중 오류 발생', err);
            // socket.emit('SEND_MESSAGE_ERROR', {message: '메시지 전송 중 오류가 발생했습니다.'});
        }
    });
}