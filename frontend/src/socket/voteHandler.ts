import { socket } from "./socketManager";
import { useEffect, useState } from "react";
import type { VoteState } from '../../../common/types';

export const useVoteHandler = () => {
    const [vote, setVote] = useState<VoteState | null>(null);
    // const [selectedItem, setSelectedItem] = useState<string | null>(null);

    useEffect(() => {
        // 투표 업데이트
        socket.on('updateVote', (data: VoteState) => {
            console.log('투표 업데이트:', data);
            setVote(data);
        });

        // 투표 종료
        socket.on('endVote', (data: VoteState) => {
            console.log('투표 종료:', data);
            setVote(data);
        });

        return () => {
            socket.off('updateVote');
            socket.off('endVote');
        };
    }, []);

    const startVote = (title: string, items: string[], isMultiple: boolean) => {
        socket.emit('startVote', {title, items, isMultiple});
    };

    const submitVote = (itemIds: string[]) => {
        socket.emit('submitVote', itemIds);
    };

    const endVote = () => {
        socket.emit('endVote');
    };

    return { vote, startVote, submitVote, endVote };
};