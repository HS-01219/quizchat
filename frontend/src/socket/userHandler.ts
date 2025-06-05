import { useEffect } from 'react';
import { socket } from './socketManager';
import {useUserStore} from "@/store/useUserStore";

export interface VoteItem { // 각 항목 식별 id, 내용, 투표 수
    itemId: number;
    text: string;
    count: number;
};

export interface VoteState { // 투표 제목, 항목, 현재 유효한지 여부, 중복 가능 여부
    title: string;
    items: VoteItem[];
    isActive: boolean;
    isMultiple: boolean;
};

export interface QuizItem { // 퀴즈 id, 문제, 정답
    id : number;
    question : string;
    answer : string;
}

export interface QuizState {
    isActive : boolean;
    quizData : QuizItem | null;
}



export const useUserHandler = () => {
    const { nickName, setNickName} = useUserStore();
    const { setCurrentUsers } = useUserStore.getState()
    useEffect(() => {
        socket.on('SEND_NICKNAME', sendNickName); // 전체 메세지
        socket.on('SEND_NICKNAME_SUCCESS', responseMessage); // 요청한 사람한테만
        socket.on('SEND_JOINED', userJoined);
        socket.on('SEND_JOINED_SUCCESS', joinRoom);
        socket.on('SEND_LEAVED', userLeaved);


        return () => {
            socket.off('SEND_NICKNAME', sendNickName);
            socket.off('SEND_NICKNAME_SUCCESS', responseMessage);
            socket.off('SEND_JOINED', userJoined);
            socket.off('SEND_JOINED_SUCCESS', joinRoom);
            socket.off('SEND_LEAVED', userLeaved);
        };
    }, []);

    /* 유저 관련 */
    const requestJoinRoom = (nickName : string) => {
        console.log(`${nickName} 님이 방에 입장했습니다.`);
        socket.emit('JOIN_ROOM', { nickName : nickName });
    }


//     const userJoined = (data : { currentUsers : number, userId : number, nickName : string }) => {
//         console.log(`${data.nickName} 님이 방에 참여했습니다. userId : ${data.userId}`);
//         // 프론트 TODO : 방 참여 또는 퇴장 알림
//         updateUserCnt(data.currentUsers);
//     }
    
//     const userLeaved = (data : { currentUsers : number, userId : number, nickName : string }) => {
//         console.log(`${data.nickName} 님이 퇴장했습니다. userId : ${data.userId}`);
//         // 프론트 TODO : 방 참여 또는 퇴장 알림
//         updateUserCnt(data.currentUsers);
//     }



    const updateUserCnt = (data: { currentUsers: number; userId: number; nickName: string }) => {
        console.log(`${data.nickName} 님이 방에 참여했습니다. 현재 인원: ${data.currentUsers}`);
        setCurrentUsers(data.currentUsers);
    };
    const joinRoom = (data : { userId : number, nickName : string, roomState : { quizState : QuizState, voteState : VoteState } }) => {
        console.log(`userId : ${data.userId} nickName : ${data.nickName}`)
        console.log(`현재 퀴즈 상태 : ${data.roomState.quizState.isActive ? data.roomState.quizState.isActive : 'X'} 
                     현재 투표 상태 : ${data.roomState.voteState.isActive ? data.roomState.voteState.isActive : 'X'}`)
        // 방 참여에 성공한 유저에게 roomState (quizState, voteState)를 전달
        // 프론트 TODO : 퀴즈나 투표가 있다면 해당 유저의 화면에 표시
    }

    /* 닉네임 변경 관련 */
    const sendNickName = (data : { userId : number, nickName : string}) => {
        console.log(`${data.userId}의 닉네임이 ${data.nickName}으로 변경됨`);
        // 프론트 TODO :해당 유저가 보낸 채팅의 닉네임 변경하는 로직 추라
    }


    const responseMessage = (data : { message : string }) => {
        alert(data.message);
    }

    const updateNickName = (data:{nickName:string}) => {
        // 프론트 TODO : userStore에서 userId 관리 추가
        // 해당 userId를 가져와서 백엔드로 보내야함
        // nickName와 userId가 둘다 userStore에 있어서 매개로 안받아도 될듯?
        // userId 체크하는 로직 필요
        if(nickName.trim() === '') {
          alert("닉네임이 빈칸입니다.");
          return;
        }

        socket.emit('UPDATE_NICKNAME', { userId : 1, nickName : nickName });

    }

    return { nickName, setNickName, updateNickName, requestJoinRoom,updateUserCnt };
}