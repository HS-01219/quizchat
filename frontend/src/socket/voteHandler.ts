import { socket } from "./socketManager";
import {useEffect, useState} from "react";
import type { VoteItem, VoteState } from "@/common/types";

import { useVoteStore } from "@/store/useVoteStore";
import {useChatStore} from "@/store/useChatStore";
// import { useMessageHandler } from "./messageHandler";
import { sendSystemMessage } from "./messageHandler";
import {useModalStore} from "@/store/useModalStore";
import {useTimerStore} from "@/store/useTimerStore";



let isVoteSocketInitialized = false;

export const useVoteHandler = () => {
    const { setVoteState , setIsTimerActive} = useVoteStore();
    const { setSystemMessages } = useChatStore();

    const [showResult, setShowResult] = useState(false);
    const {
        voteState,
        resetVote,
        isVoteCreator,
        voteItems
    } = useVoteStore();
    const isCreator = isVoteCreator();
    const { resetTimer } = useTimerStore();

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    const updateFromServer=useVoteStore((state) => state.updateFromServer);
//   const { sendSystemMessage } = useMessageHandler();

    
    useEffect(() => {
        if (isVoteSocketInitialized) return;
        isVoteSocketInitialized = true;
        socket.emit("GET_CURRENT_VOTE");

        socket.on("START_VOTE", (data: VoteState) => {
            console.log("투표 시작됨:", data);
            setVoteState(data);
            updateFromServer(data);
            console.log("🔥 서버로부터 받은 투표 상태:", data);
            useVoteStore.getState().setVoteState(data);
            useVoteStore.getState().updateFromServer(data);
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
        // setSystemMessages({items: [], type: "voteStart", time: getCurrentTime() });
        sendSystemMessage({
            items: [],
            type: "voteStart",
            time: getCurrentTime(),
        });

        socket.emit('START_VOTE', data);
    };

    // 투표 참여
    const submitVote = (itemIds: number[]) => {
        console.log('투표 참여:', itemIds);
        socket.emit('SUBMIT_VOTE',  itemIds);
    };

    const endVote = (items:VoteItem[]) => {
        console.log('투표 종료 요청');
        // setSystemMessages({items: [], type: "voteEnd", time: getCurrentTime() });
        sendSystemMessage({
            items: [],
            type: "voteEnd",
            time: getCurrentTime(),
        });
        // setSystemMessages({items: items, type: "voteResult", time: getCurrentTime() });
        sendSystemMessage({
            items: items,
            type: "voteResult",
            time: getCurrentTime(),
        });
        socket.emit('END_VOTE');
    };

    return { startVote, submitVote, endVote };
};