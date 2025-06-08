// import { Server, Socket } from 'socket.io';
// import type { StartVotePayload, VoteState } from '../common/types';
// import { getRedisValue, setRedisValue, delRedisValue } from '../utils/redis';
//
// let currentVote: VoteState | null = null;
//
// // Redis : 최신 투표 상태 로드
// async function loadCurrentVoteFromRedis(): Promise<VoteState | null> {
//     const voteStateRaw = await getRedisValue('vote_state');
//     return voteStateRaw ? JSON.parse(voteStateRaw) : null;
// }
//
// // Redis : 투표 상태 저장
// async function saveCurrentVoteToRedis(voteState: VoteState | null){
//     if(voteState){
//         await setRedisValue('vote_state', JSON.stringify(voteState), 60 * 60 * 24); // 24시간 유지
//     }else{
//         await delRedisValue('vote_state'); // 투표 종료 시 삭제
//     }
// }
//
// // Redis : 모든 유저의 투표 로드
// async function loadUserVotesFromRedis(): Promise<Map<number, Set<number>>>{
//     const userVotesMap = new Map<number, Set<number>>();
//     const allVotesRaw = await getRedisValue('user_votes_hash');
//
//     if(allVotesRaw){
//         const parsed = JSON.parse(allVotesRaw);
//         for (const userIdStr in parsed){
//             userVotesMap.set(parseInt(userIdStr, 10), new Set<number>(parsed[userIdStr]));
//         }
//     }
//
//     return userVotesMap;
// }
//
// // Redis : 모든 유저의 투표 저장
// async function saveUserVotesToRedis(userVotes: Map<number, Set<number>>){
//     const plainObject: {[key: number]: number[]} = {};
//     userVotes.forEach((votedItems, userId) => {
//         plainObject[userId] = Array.from(votedItems);
//     });
//     await setRedisValue('user_votes_hash', JSON.stringify(plainObject), 60 * 60 * 24); // 24시간 유지
// }
//
// //
// function validateItem(currentVote: VoteState, itemId: number, userId: number): boolean {
//     const isValidItem = currentVote.items.some(item => item.itemId === itemId);
//     if(!isValidItem){
//         console.warn(userId, ':유효하지 않은 투표 항목 ', itemId);
//     }
//     return isValidItem;
// }
//
// export function handleVote(io: Server, socket: Socket) {
//     // 투표 생성(시작)
//     socket.on('START_VOTE', async ({title, items, isMultiple}: StartVotePayload) => {
//         console.log('투표 시작:', {title, items, isMultiple});
//         currentVote = {
//             userId: socket.data.userId,
//             title,
//             items: items.map(item => ({
//                 itemId: item.itemId,
//                 text: item.text,
//                 count: 0
//             })),
//             isActive: true,
//             isMultiple
//         };
//
//         // userVotes.clear();
//         await delRedisValue('user_votes_hash'); // 모든 유저 투표 기록 삭제
//         await saveCurrentVoteToRedis(currentVote); // Redis에 현재 투표 상태 저장
//         io.emit('START_VOTE', currentVote);
//         io.emit('UPDATE_VOTE', currentVote);
//     });
//
//     // 투표 참여
//     socket.on('SUBMIT_VOTE', async (itemIds: number[]) => {
//         const userId: number = socket.data.userId;
//
//         currentVote = await loadCurrentVoteFromRedis(); // Redis에서 현재 투표 상태 로드
//         const userVotes = await loadUserVotesFromRedis(); // Redis에서 모든 유저 투표 기록 로드
//
//         if(!currentVote || !currentVote.isActive) return;
//
//         console.log('투표 참여:', itemIds);
//
//         const prevVotes = userVotes.get(userId) ?? new Set<number>();
//         const nextVotes = new Set<number>();
//         let hasVoteChanged = false;
//
//         const validItemIds = itemIds.filter(itemId => validateItem(currentVote!, itemId, userId));
//
//         if(currentVote.isMultiple){ // 중복 투표 모드
//             for(const itemId of validItemIds){
//                 nextVotes.add(itemId);
//             }
//             const prevArray = Array.from(prevVotes);
//             const nextArray = Array.from(nextVotes);
//             hasVoteChanged = !(prevArray.length === nextArray.length && prevArray.every(item => nextVotes.has(item)))
//         }else{ // 단일 투표 모드
//             const newItemId = itemIds[0];
//
//             if(prevVotes.has(newItemId) && validItemIds.length ===1){ // 이미 투표한 항목을 다시 선택한 경우
//                 nextVotes.clear();
//                 hasVoteChanged = true;
//             }else if(validItemIds.length === 1){ // 새 항목 선택
//                 nextVotes.add(newItemId);
//                 hasVoteChanged = true;
//             }else{ // 유효하지 않은 항목 선택 or 여러 항목 선택 -> 무시
//                 hasVoteChanged = false;
//             }
//         }
//
//         // 변경 사항이 있을 때만 처리
//         if(hasVoteChanged) {
//             userVotes.set(userId, nextVotes); // userId 기준으로 투표 기록 업데이트
//             currentVote.items.forEach(item => {item.count = 0;}); // 모든 항목 카운트 초기화
//
//             // 모든 유저의 투표 다시 집계계
//             userVotes.forEach(votedItems => {
//                 votedItems.forEach(itemId => {
//                     const item = currentVote!.items.find(i => i.itemId === itemId);
//                     if(item) item.count++;
//                 });
//             });
//
//             await saveCurrentVoteToRedis(currentVote); // Redis에 현재 투표 상태 저장
//             await saveUserVotesToRedis(userVotes); // Redis에 모든 유저 투표 기록 저장
//
//             io.emit('UPDATE_VOTE', currentVote);
//         }
//     });
//
//     // 투표 종료
//     socket.on('END_VOTE', async () => {
//         currentVote = await loadCurrentVoteFromRedis(); // Redis에서 현재 투표 상태 로드
//
//         if(currentVote && currentVote.isActive) {
//             currentVote.isActive = false;
//
//             await saveCurrentVoteToRedis(null); // Redis에서 투표 상태 삭제
//             await delRedisValue('user_votes_hash'); // 모든 유저 투표 기록 삭제
//
//             console.log('투표 종료', currentVote);
//             io.emit('END_VOTE', currentVote);
//         }
//     });
// }
import { Server, Socket } from 'socket.io';
import type { StartVotePayload, VoteState } from '../common/types';
import { getRedisValue, setRedisValue, delRedisValue } from '../utils/redis';

let currentVote: VoteState | null = null;
let userVotes = new Map<number, Set<number>>(); // ⭐ 메모리에서 관리

// Redis : 최신 투표 상태 로드
async function loadCurrentVoteFromRedis(): Promise<VoteState | null> {
    const voteStateRaw = await getRedisValue('vote_state');
    return voteStateRaw ? JSON.parse(voteStateRaw) : null;
}

// Redis : 투표 상태 저장
async function saveCurrentVoteToRedis(voteState: VoteState | null){
    if(voteState){
        await setRedisValue('vote_state', JSON.stringify(voteState), 60 * 60 * 24);
    }else{
        await delRedisValue('vote_state');
    }
}

// Redis : 모든 유저의 투표 로드
async function loadUserVotesFromRedis(): Promise<Map<number, Set<number>>>{
    const userVotesMap = new Map<number, Set<number>>();
    const allVotesRaw = await getRedisValue('user_votes_hash');

    if(allVotesRaw){
        const parsed = JSON.parse(allVotesRaw);
        for (const userIdStr in parsed){
            userVotesMap.set(parseInt(userIdStr, 10), new Set<number>(parsed[userIdStr]));
        }
    }

    return userVotesMap;
}

// Redis : 모든 유저의 투표 저장
async function saveUserVotesToRedis(userVotes: Map<number, Set<number>>){
    const plainObject: {[key: number]: number[]} = {};
    userVotes.forEach((votedItems, userId) => {
        plainObject[userId] = Array.from(votedItems);
    });

    await setRedisValue('user_votes_hash', JSON.stringify(plainObject), 60 * 60 * 24);
}

export function handleVote(io: Server, socket: Socket) {
    // 투표 생성(시작)
    socket.on('START_VOTE', async ({title, items, isMultiple}: StartVotePayload) => {
        console.log('투표 시작:', {title, items, isMultiple});
        currentVote = {
            userId: socket.data.userId,
            title,
            items: items.map(item => ({
                itemId: item.itemId,
                text: item.text,
                count: 0
            })),
            isActive: true,
            isMultiple
        };

        // ⭐ 메모리와 Redis 모두 초기화
        userVotes.clear();
        await delRedisValue('user_votes_hash');
        await saveCurrentVoteToRedis(currentVote);

        io.emit('START_VOTE', currentVote);
        io.emit('UPDATE_VOTE', currentVote);
    });

    // 투표 참여
    socket.on('SUBMIT_VOTE', async (itemIds: number[]) => {
        const userId: number = socket.data.userId;
        console.log('받은 itemIds:', itemIds, 'userId:', userId);

        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            console.warn('유효하지 않은 itemIds:', itemIds);
            return;
        }

        // ⭐ 수정: 메모리 상태 우선, Redis는 서버 재시작 시에만 로드
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
            userVotes = await loadUserVotesFromRedis();
        }

        console.log('🔍 백엔드 - 받은 데이터:', { userId, itemIds, timestamp: new Date().toISOString() });

        if (!currentVote || !currentVote.isActive) {
            console.log('투표가 활성화되지 않음');
            return;
        }

        console.log('투표 참여 시도:', { userId, itemIds, isMultiple: currentVote.isMultiple });

        // 유효한 itemId만 필터링
        const validItemIds = itemIds.filter(itemId => {
            const exists = currentVote!.items.some(item => item.itemId === itemId);
            if (!exists) {
                console.warn(`존재하지 않는 itemId: ${itemId}`);
            }
            return exists;
        });

        if (validItemIds.length === 0) {
            console.warn('유효한 투표 항목이 없습니다');
            return;
        }

        // ⭐ 수정: 메모리에서 이전 투표 조회
        const prevVotes = userVotes.get(userId) ?? new Set<number>();
        const nextVotes = new Set<number>();
        let hasVoteChanged = false;

        console.log('🔍 백엔드 - 이전 투표 상태:', {
            userId,
            prevVotes: Array.from(prevVotes),
            메모리_전체상태: Array.from(userVotes.entries()).map(([uid, votes]) => ({
                userId: uid,
                votes: Array.from(votes)
            }))
        });

        if (currentVote.isMultiple) {
            // 중복 투표 모드
            prevVotes.forEach(itemId => nextVotes.add(itemId));

            validItemIds.forEach(itemId => {
                if (nextVotes.has(itemId)) {
                    nextVotes.delete(itemId);
                } else {
                    nextVotes.add(itemId);
                }
            });

            const prevArray = Array.from(prevVotes).sort();
            const nextArray = Array.from(nextVotes).sort();
            hasVoteChanged = JSON.stringify(prevArray) !== JSON.stringify(nextArray);

        } else {
            // 단일 투표 모드
            const newItemId = validItemIds[0];
            console.log('🔍 백엔드 - 단일 투표 처리:', { newItemId, prevVotes: Array.from(prevVotes) });

            nextVotes.add(newItemId);
            hasVoteChanged = prevVotes.size !== 1 || !prevVotes.has(newItemId);

            console.log('단일 투표 처리:', {
                prevVotes: Array.from(prevVotes),
                newSelection: newItemId,
                nextVotes: Array.from(nextVotes),
                hasChanged: hasVoteChanged
            });
        }

        console.log('투표 변경사항:', {
            prevVotes: Array.from(prevVotes),
            nextVotes: Array.from(nextVotes),
            hasVoteChanged
        });

        if (hasVoteChanged) {
            // ⭐ 수정: 메모리 상태 업데이트
            if (nextVotes.size === 0) {
                userVotes.delete(userId);
            } else {
                userVotes.set(userId, nextVotes);
            }

            // 전체 투표 집계 재계산
            currentVote.items.forEach(item => {
                item.count = 0;
            });

            userVotes.forEach(votedItems => {
                votedItems.forEach(itemId => {
                    const item = currentVote!.items.find(i => i.itemId === itemId);
                    if (item) {
                        item.count++;
                    }
                });
            });

            console.log('🔍 백엔드 - 최종 투표 집계:', currentVote.items.map(item => ({
                itemId: item.itemId,
                text: item.text,
                count: item.count
            })));

            // Redis에 동기화 (백업용)
            await saveCurrentVoteToRedis(currentVote);
            await saveUserVotesToRedis(userVotes);

            io.emit('UPDATE_VOTE', currentVote);
        }
    });

    // 투표 종료
    socket.on('END_VOTE', async () => {
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
        }

        if(currentVote && currentVote.isActive) {
            currentVote.isActive = false;
            currentVote = null;
            userVotes.clear();

            await saveCurrentVoteToRedis(null);
            await delRedisValue('user_votes_hash');

            console.log('투표 종료');
            io.emit('END_VOTE', null);
        }
    });

    // 투표 상태 조회
    socket.on('GET_CURRENT_VOTE', async () => {
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
            userVotes = await loadUserVotesFromRedis();
        }
        if (currentVote) {
            socket.emit('START_VOTE', currentVote);
        }
    });
}