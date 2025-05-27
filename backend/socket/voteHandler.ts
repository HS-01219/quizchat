import { Server, Socket } from 'socket.io';
import type { StartVotePayload, VoteItem, VoteState } from '../../common/types';

let currentVote: VoteState | null = null;
const userVotes = new Map<string, Set<string>>();

export function handleVote(io: Server, socket: Socket) {
    // 투표 생성(시작)
    socket.on('startVote', ({title, items, isMultiple}: StartVotePayload) => {
        console.log('투표 시작:', {title, items, isMultiple});
        currentVote = {
            title,
            items: items.map((text, index) => ({
                itemId: index.toString(),
                text,
                count: 0
            })),
            isActive: true,
            isMultiple
        };

        userVotes.clear();
        io.emit('updateVote', currentVote);
    });

    // 투표 참여
    socket.on('submitVote', (itemIds: string[]) => {
        console.log('투표 참여:', itemIds);
        if(!currentVote || !currentVote.isActive) return;

        const prevVotes = userVotes.get(socket.id) ?? new Set<string>();
        const nextVotes = new Set(prevVotes);

        if(currentVote.isMultiple){ // 중복 투표 모드
            for(const prevId of prevVotes){
                if(!itemIds.includes(prevId)){
                    const item = currentVote
                }
            }





            for(const id of itemIds){
                const item = currentVote.items.find(i => i.itemId === id);
                if(!item) continue;

                if(nextVotes.has(id)){
                    nextVotes.delete(id);
                    item.count = Math.max(0, item.count - 1);
                    console.log('항목 취소:', id);
                }else{
                    nextVotes.add(id);
                    item.count += 1;
                    console.log('항목 추가:', id);
                }
            }
        }else{ // 단일 투표 모드
            const newId = itemIds[0];
            const prevId = [...prevVotes][0];

            if(newId === prevId){
                const item = currentVote.items.find(i => i.itemId === newId);
                if(item){
                    nextVotes.delete(newId);
                    item.count = Math.max(0, item.count - 1);
                    console.log('항목 취소:', newId);
                }
            }else{
                if(prevId){
                    const prevItem = currentVote.items.find(i => i.itemId === prevId);
                    if(prevItem){
                        prevItem.count = Math.max(0, prevItem.count - 1);
                        console.log('항목 취소:', prevItem);
                    }
                    nextVotes.clear();
                }
            }

            const newItem = currentVote.items.find(i => i.itemId === newId);
            if(newItem){
                nextVotes.add(newId);
                newItem.count += 1;
                console.log('항목 추가:', newId);
            }
        }

        userVotes.set(socket.id, nextVotes);
        io.emit('updateVote', currentVote);
    });

    // 투표 종료
    socket.on('endVote', () => {
        console.log('투표 종료', currentVote);
        if(currentVote && currentVote.isActive) {
            currentVote.isActive = false;
            io.emit('endVote', currentVote);
        }
    });
}