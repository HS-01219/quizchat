import { Server, Socket } from "socket.io";
import { userHandler } from "../socket/userHandler";

interface userPayload {
    userId : number;
    nickName : string;
};

export const setupSocketIO = (io : Server) => {
    io.on('connection', (socket : Socket) => {
        console.log('새로운 클라이언트 연결됨');

        // 연결이 끊어졌을 때
        socket.on('disconnect', () => {
            console.log('클라이언트 연결 끊김');
        });

        // 에러 발생 시
        socket.on('error', (error) => {
            console.error('소켓 에러:', error);
        });

        socket.on('UPDATE_NICKNAME', async ({ userId, nickName } : userPayload) => {
            console.log('닉네임 변경 요청:', userId, nickName);
            try {
                // userHanler에서 닉네임 변경 호출 (DB UPDATE)
                const result = await userHandler.updateNickName(userId, nickName);
                if (result) { // .affectedRows > 0
                    console.log('닉네임 변경 성공:', result);
                    io.emit('SEND_NICKNAME', { userId : userId, nickName : nickName });
                    socket.emit('SEND_NICKNAME_SUCCESS', { message : '닉네임이 성공적으로 변경되었습니다.'});
                } else {
                    console.error('닉네임 변경 실패 - 유저 없음:', result);
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
            // DB INSERT, userId 받아오기
            const result = await userHandler.joinRoom(nickName);

            if(result) {
                // 이 때 잔여 인원 수를 함께 전달한다
                io.emit('SEND_JOINED', { currentUsers : userCnt });

                // 퀴즈/투표가 진행중인지, 진행중이라면 내용을 전달
                // JOIN_ROOM 을 보낸 클라이언트에게만 전달
                socket.emit('SEND_JOINED_SUCCESS', {
                    userId : result.insertId,
                    nickName : nickName,
                    roomState : {
                        quizState : false, // 퀴즈가 진행중인지
                        quizData : null, // 퀴즈 데이터
                        voteState : false,
                        voteData : null,
                    }
                });
            } else {
                // 이미 존재하는 유저일 경우
                socket.emit('SEND_JOINED_ERROR', { message: '이미 존재하는 유저입니다.' });
                return;
            }
        });

        socket.on('LEAVE_ROOM', async ({ userId } : userPayload) => {
            console.log('방 나가기', userId);
            // user 테이블에서 어떻게 처리할지는 논의가 필요
            socket.emit('SEND_LEAVE_ROOM_SUCCESS', { message : '방을 나갔습니다. '});
            io.emit('SEND_LEAVE_ROOM', { userId : userId });
        });

        socket.on('START_QUIZ', async (msg) => {
            // 퀴즈를 조회 후 전달(DB SELECT)
            const result = await userHandler.selectQuiz();
            if(result) {
                // 퀴즈가 존재할 경우
                // 퀴즈 정답은 서버 임시 저장소에 가지고 있기
                io.emit('START_QUIZ_SUCCESS', { quizData : result, quizState : true });
            } else {
                // 퀴즈가 존재하지 않을 경우
                socket.emit('START_QUIZ_ERROR', { message: '퀴즈가 존재하지 않습니다.' });
                return;
            }
        });

        socket.on('ANSWER_QUIZ', async ({userId, nickName, submitAnswer}) => {
            // if절로 퀴즈가 진행되고 있을때만 아래 로직을 수행한다
            const currentQuiz = getCurrentQuizState(data.roomId);
            if(currentQuiz.quizState) {
                if(isQuizEnded) {
                    console.log("정답자 나옴")
                    return;
                }

                // 서버가 가지고 있는 정답과 일치하는지 체크
                const isCorrect = checkAnswer(submitAnswer, correctAnswer);
    
                // 정답일 경우
                if(isCorrect) {
                    // 해당 메세지를 보낸 유저id, 닉네임 같이 전달
                    isQuizEnded = true;
                    const winnerId = userId; // 정답을 제출한 유저의 ID
                    const winnerNickName = nickName; // 정답을 제출한 유저의 닉네임
                    const answer = currentQuiz.answer; // 정답
    
                    // 서버 내부에서 퀴즈 종료 후 클라이언트에게 퀴즈 종료 신호와
                    // 정답자, 정답 전달
                    io.emit('END_QUIZ', { winnerId : winnerId, winnerNickName : winnerNickName, answer : answer});
                }
            } else {
                // 퀴즈가 진행중이지 않을 경우
                socket.emit('ANSWER_QUIZ_ERROR', { message: '퀴즈가 진행중이지 않습니다.' });
                return;
            }
        });
    });
}