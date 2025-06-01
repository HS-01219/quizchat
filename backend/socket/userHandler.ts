import pool from '../db/mariadb';
import { ResultSetHeader } from 'mysql2/promise';
import { Server, Socket } from "socket.io";
import { getRedisValue, setRedisValue } from '../utils/redis';

interface userPayload {
    userId?: number;
    nickName : string;
};

export function handleUser(io : Server, socket : Socket) {
    socket.on('UPDATE_NICKNAME', async ({ userId, nickName } : userPayload) => {
        console.log('닉네임 변경 요청:', userId, nickName);
        try {
            // const result = await updateNickName(userId, nickName);
            const result = {affectedRows : 1}; // 테스트용

            if (result && result.affectedRows > 0) {
                console.log('닉네임 변경 성공:', result);
                io.emit('SEND_NICKNAME', { userId : userId, nickName : nickName });
                socket.emit('SEND_NICKNAME_SUCCESS', { message : '닉네임이 성공적으로 변경되었습니다.'});
            } else {
                console.log('닉네임 변경 실패 - 유저 없음:', result);
                socket.emit('SEND_NICKNAME_ERROR', { message: '일치하는 유저가 존재하지 않습니다.' });
                return;
            }
        } catch (err : any) {
            console.error('닉네임 변경 실패 - 서버에러:', err.message);
            socket.emit('SEND_NICKNAME_ERROR', { message: '닉네임 변경 중 오류가 발생했습니다.' });
            return;
        }
    });

    socket.on('JOIN_ROOM', async ({ nickName } : userPayload) => {
        console.log('채팅방 참여 요청', nickName)
        try {
            // const result = await joinRoom(nickName);
            const result = {affectedRows : 1, insertId : 1}; // 테스트용

            if(result && result.affectedRows > 0) {
                console.log('채팅방 참여 성공')
                socket.data.userId = result.insertId;
                socket.data.nickName = nickName;

                const currentUsers = await getRedisValue('currentUsers');
                const userCnt = currentUsers ? parseInt(currentUsers) + 1 : 1;
                setRedisValue('currentUsers', userCnt.toString(), 60 * 60);
                
                // 이 때 잔여 인원 수를 함께 전달 (Redis)
                io.emit('SEND_JOINED', { 
                    currentUsers : userCnt,
                    userId : result.insertId,
                    nickName : nickName,
                });
                
                // 퀴즈/투표가 진행중인지, 진행중이라면 내용을 전달 (Redis)
                const quizStateRaw = await getRedisValue('quizState');
                const voteStateRaw = await getRedisValue('voteState');
                const quizState = quizStateRaw ? JSON.parse(quizStateRaw) : null;
                const voteState = voteStateRaw ? JSON.parse(voteStateRaw) : null;

                // JOIN_ROOM 을 보낸 클라이언트에게만 전달
                socket.emit('SEND_JOINED_SUCCESS', {
                    userId : socket.data.userId,
                    nickName : socket.data.nickName,
                    roomState : {
                        quizState,
                        voteState,
                    }
                });
            } else {
                console.log("채팅방 참여 실패 - insert 실패", result);
                socket.emit('SEND_JOINED_ERROR', { message: '유저가 등록되지 않았습니다.' });
                return;
            }
        } catch (err : any) {
            console.error('채팅방 참여 실패 - 서버 에러', err.message);
            socket.emit('SEND_JOINED_ERROR', { message: '채팅방 참여 중 오류가 발생했습니다.' });
            return;
        }
    });

    socket.on('LEAVE_ROOM', async ({ userId, nickName } : userPayload) => {
        if(userId) {
            userLeave(io, socket);
        }
    });
}

export const userLeave = async (io : Server, socket : Socket) : Promise<void> => {
    console.log('방 나가기', socket.data.userId);
    try {
        // user 테이블에서 어떻게 처리할지는 논의가 필요
        // const result = await leaveRoom(userId);
        const result = {affectedRows : 1}; // 테스트용

        const currentUsers = await getRedisValue('currentUsers');
        const userCnt = currentUsers ? parseInt(currentUsers) - 1 : 0;
        setRedisValue('currentUsers', userCnt.toString(), 60 * 60);

        io.emit('SEND_LEAVED', { 
            currentUsers : userCnt,
            userId : socket.data.userId,
            nickName : socket.data.nickName,
        });
    } catch(err : any) {
        console.error('채팅방 퇴장 실패 - 서버 에러', err.message);
        socket.emit('SEND_LEAVED_ERROR', { message: '채팅방 퇴장 중 오류가 발생했습니다.' });
        return;
    }
}

const updateNickName = async (userId: number, nickName: string) : Promise<ResultSetHeader | null> => {
    const query = 'UPDATE users SET nickname = ? WHERE id = ?';
    const values = [nickName, userId];

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query<ResultSetHeader>(query, values);
        return results;
    } catch (err) {
        console.error('DB에러 : 닉네임 업데이트 오류', err);
        throw err;
    } finally {
        connection.release();
    }
};


const joinRoom = async (nickName: string): Promise<ResultSetHeader | null> => {
    // id는 AUTO_INCREMENT로 자동 생성
    const query = 'INSERT INTO users (nickname) VALUES (?)';
    const values = [nickName];

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query<ResultSetHeader>(query, values);
        return results;
    } catch (err) {
        console.error('DB에러 : 유저 INSERT 오류', err);
        throw err;
    }
};

const leaveRoom = async (userId : number) : Promise<ResultSetHeader | null> => {
    const query = 'DELETE FROM users WHERE id = ?';
    const values = [userId];

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query<ResultSetHeader>(query, values);
        return results;
    } catch (err) {
        console.error('DB에러 : 유저 INSERT 오류', err);
        throw err;
    }
};
