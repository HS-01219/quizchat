// import { socket } from "./socketManager";
// import { useEffect } from "react";
// import type { VoteItem, VoteState } from "@/common/types"
// import {useRoomStore} from "@/store/useRoomStore";
//
// export const useVoteHandler = () => {
// const {setVoteState} = useRoomStore.getState();
//     // const [selectedItem, setSelectedItem] = useState<string | null>(null);
//
//     useEffect(() => {
//         // 투표 업데이트
//         socket.on('UPDATE_VOTE', (data: VoteState) => {
//             console.log('투표 업데이트:', data);
//             setVoteState(data);
//         });
//
//         // 투표 종료
//         socket.on('END_VOTE', (data: VoteState) => {
//             console.log('투표 종료:', data);
//             setVoteState(data);
//         });
//         socket.on("START_VOTE", (data: VoteState) => {
//             console.log("투표 시작됨:", data);
//             setVoteState(data);
//         });
//
//
//         return () => {
//             socket.off("START_VOTE");
//             socket.off('UPDATE_VOTE');
//             socket.off('END_VOTE');
//         };
//     }, []);
//
//     const startVote = (data:{title: string, items: VoteItem[], isMultiple: boolean}) => {
//         socket.emit('START_VOTE', data);
//         console.log(`startVote`,data);
//
//     };
//
//     //투표 참여
//     const submitVote = (itemIds: number[]) => {
//         socket.emit('SUBMIT_VOTE', itemIds);
//     };
//
//     const endVote = () => {
//         socket.emit('END_VOTE');
//     };
//
//     return {  startVote, submitVote, endVote };
// };
import { socket } from "./socketManager";
import { useEffect } from "react";
import type { VoteItem, VoteState } from "@/common/types";
import { useRoomStore } from "@/store/useRoomStore";
import { useVoteStore } from "@/store/useVoteStore";

let isVoteSocketInitialized = false;

export const useVoteHandler = () => {
    const { setVoteState } = useRoomStore();
    const { setIsSave, setIsTimerActive, endVote: endVoteLocal, setTitle, setVoteItems, setIsDuplicated } = useVoteStore();

    useEffect(() => {
        if (isVoteSocketInitialized) return;
        isVoteSocketInitialized = true;

        console.log('투표 소켓 이벤트 리스너 등록');

        // 투표 시작 이벤트
        socket.on("START_VOTE", (data: VoteState) => {
            console.log("투표 시작됨:", data);
            setVoteState(data);

            // 로컬 상태도 업데이트
            setTitle(data.title);
            setVoteItems(() => data.items.map(item => ({
                id: item.itemId,
                text: item.text,
                count: item.count || 0
            })));
            setIsDuplicated(data.isMultiple);
            setIsSave(true);
            setIsTimerActive(true);
        });

        // 투표 업데이트 이벤트
        socket.on('UPDATE_VOTE', (data: VoteState) => {
            console.log('투표 업데이트:', data);
            setVoteState(data);

            // 투표 결과 업데이트
            setVoteItems(() => data.items.map(item => ({
                id: item.itemId,
                text: item.text,
                count: item.count || 0
            })));
        });

        // 투표 종료 이벤트
        socket.on('END_VOTE', (data: VoteState) => {
            console.log('투표 종료:', data);
            setVoteState(data);
            setIsTimerActive(false);
            endVoteLocal();
        });

        // 투표 참여 성공 이벤트 (선택사항)
        socket.on('VOTE_SUCCESS', (data: { message: string }) => {
            console.log('투표 참여 성공:', data.message);
        });

        // 투표 에러 이벤트 (선택사항)
        socket.on('VOTE_ERROR', (data: { message: string }) => {
            console.error('투표 에러:', data.message);
            alert(data.message);
        });

        return () => {
            console.log('투표 소켓 이벤트 리스너 해제');
            socket.off("START_VOTE");
            socket.off('UPDATE_VOTE');
            socket.off('END_VOTE');
            socket.off('VOTE_SUCCESS');
            socket.off('VOTE_ERROR');
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
        socket.emit('SUBMIT_VOTE', { itemIds });
    };

    const endVote = () => {
        console.log('투표 종료 요청');


        socket.emit('END_VOTE');
    };

    return { startVote, submitVote, endVote };
};