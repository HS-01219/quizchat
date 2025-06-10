import { Server, Socket } from 'socket.io';
import type { StartVotePayload, VoteState } from '../common/types';
import { getRedisValue, setRedisValue, delRedisValue } from '../utils/redis';

let currentVote: VoteState | null = null; // 현재 투표 상태 저장
let userVotes = new Map<number, Set<number>>(); // 사용자의 개별 투표 기록록 저장

// Redis : 현재 투표 상태 로드
async function loadCurrentVoteFromRedis(): Promise<VoteState | null> {
    const voteStateRaw = await getRedisValue('voteState');
    return voteStateRaw ? JSON.parse(voteStateRaw) : null;
}

// Redis : 현재 투표 상태 저장
async function saveCurrentVoteToRedis(voteState: VoteState | null){
    if(voteState){
        await setRedisValue('voteState', JSON.stringify(voteState), 60 * 60 * 24);
    }else{
        await delRedisValue('voteState');
    }
}

// Redis : 모든 유저의 투표 기록 로드
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

// Redis : 모든 유저의 투표 기록 저장
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

        // 메모리/Redis 초기화 & 생성된 투표 상태 저장
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

        // 입력 유효성 검사사
        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            console.warn('유효하지 않은 itemIds:', itemIds);
            return;
        }

        // 현재 투표 상태 로드 (메모리 우선, 없으면 Redis에서 로드)
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
            userVotes = await loadUserVotesFromRedis();
        }

        console.log('🔍 백엔드 - 받은 데이터:', { userId, itemIds, timestamp: new Date().toISOString() });

        // 투표 활성화 상태 확인
        if (!currentVote || !currentVote.isActive) {
            console.log('투표가 활성화되지 않음');
            return;
        }

        console.log('투표 참여 시도:', { userId, itemIds, isMultiple: currentVote.isMultiple });

        // 유효한 투표 항목 필터링
        const validItemIds = itemIds.filter(itemId => {
            const exists = currentVote!.items.some(item => item.itemId === itemId);
            if (!exists) {
                console.warn(`존재하지 않는 itemId: ${itemId}`);
            }
            return exists;
        });

        // 유효한 항목이 없으면 처리 중단단
        if (validItemIds.length === 0) {
            console.warn('유효한 투표 항목이 없습니다');
            return;
        }

        // 이전 투표 상태 조회 및 변경 여부 초기화
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
            // 새로 받은 vaildItemids(현재 체크된 모든 항목 id) 그대로 nextVotes로 사용
            validItemIds.forEach(itemId => {
                nextVotes.add(itemId);
            });

            // 이전 투표 상태와 새로운 투표 상태 비교하여 변경 여부 확인
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

        // 변경 사항이 있을 때만 투표 상태 업데이트 및 집계
        if (hasVoteChanged) {
            // 사용자별 투표 기록 업데이트
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
        // 현재 투표 상태 로드 (메모리 우선, 없으면 Redis에서 로드)
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
        }

        // 투표 상태 업데이트 및 메모리/Redis 초기화
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
        // 현재 투표 상태 로드 (메모리 우선, 없으면 Redis에서 로드)
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
            userVotes = await loadUserVotesFromRedis();
        }
        // 클라이언트에 현재 투표 상태 전송
        if (currentVote) {
            socket.emit("CURRENT_VOTE", currentVote);
        }
    });
}