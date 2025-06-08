import { socket } from "./socketManager";
import { useEffect } from "react";
import type { VoteItem, VoteState } from "@/common/types";
import { useRoomStore } from "@/store/useRoomStore";
import { useVoteStore } from "@/store/useVoteStore";

let isVoteSocketInitialized = false;

export const useVoteHandler = () => {
    const { setVoteState } = useRoomStore();
    const {  setIsTimerActive, endVote: endVoteLocal} = useVoteStore();
    const updateFromServer=useVoteStore((state) => state.updateFromServer);
    useEffect(() => {
        if (isVoteSocketInitialized) return;
        isVoteSocketInitialized = true;
        socket.emit("GET_CURRENT_VOTE");


        socket.on("START_VOTE", (data: VoteState) => {
            console.log("투표 시작됨:", data);
            setVoteState(data);
            updateFromServer(data);

        });

        // 투표 업데이트 이벤트
        socket.on('UPDATE_VOTE', (data: VoteState) => {
            console.log('투표 업데이트:', data);
            setVoteState(data);
            updateFromServer(data);
        });
        // 투표 종료 이벤트
        socket.on('END_VOTE', (data: VoteState) => {
            console.log('투표 종료:', data);
            setVoteState(data);
            setIsTimerActive(false);
            endVoteLocal();
        });

        return () => {
            console.log('투표 소켓 이벤트 리스너 해제');
            socket.off("START_VOTE");
            socket.off('UPDATE_VOTE');
            socket.off('END_VOTE');
            isVoteSocketInitialized = false;
        };
    }, []);

    const startVote = (data: { title: string, items: VoteItem[], isMultiple: boolean }) => {
        console.log('투표 시작 요청:', data);
        socket.emit('START_VOTE', data);
    };

    // 투표 참여
    const submitVote = (itemIds: number[]) => {
        console.log('투표 참여:', itemIds);
        socket.emit('SUBMIT_VOTE',  itemIds);
    };

    const endVote = () => {
        console.log('투표 종료 요청');
        socket.emit('END_VOTE');
    };

    return { startVote, submitVote, endVote };
};