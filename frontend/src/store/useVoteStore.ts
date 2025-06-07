import { create } from "zustand";

interface VoteItem {
	id: number;
	text: string;
	count: number;
}

interface VoteStore {
	title: string;
	voteItems: VoteItem[];
	isSave: boolean;
	isDuplicated: boolean;
	selectedVoteId: number[];
	isTimerActive: boolean;
	isVoteEnded: boolean;
	voteCreatorId: number | null;
	currentUserId: number | null;

	setIsSave: (state: boolean) => void;
	setTitle: (title: string) => void;
	setVoteItems: (fn: (prev: VoteItem[]) => VoteItem[]) => void;
	setIsDuplicated: (value: boolean) => void;
	deleteVoteItem: (id: number) => void;
	setSelectedVoteId: (fn: (prev: number[]) => number[]) => void;
	isVote: (id: number) => void;
	setIsTimerActive: (active: boolean) => void;
	endVote: () => void;
	resetVote: () => void;
	setCurrentUserId: (userId: number) => void;
	isVoteCreator: () => boolean;
	setVoteCreatorId: (userId: number) => void;

	updateFromServer: (data: {
		title: string;
		items: Array<{ itemId: number; text: string; count: number }>;
		isMultiple: boolean;
		isActive: boolean;
		isEnded: boolean;
		userId?: number;
	}) => void;
}

export const useVoteStore = create<VoteStore>((set, get) => ({
	title: "",
	voteItems: [
		{ id: Date.now(), text: "", count: 0 },
		{ id: Date.now() + 1, text: "", count: 0 },
	],
	isSave: false,
	isDuplicated: false,
	selectedVoteId: [],
	isTimerActive: false,
	isVoteEnded: false,
	voteCreatorId: null,
	currentUserId: null,

	setTitle: (title) => {
		console.log('제목 설정:', title);
		set({ title });
	},

	setVoteItems: (fn) =>
		set((state) => {
			const newItems = fn(state.voteItems);
			console.log('투표 항목 업데이트:', newItems);
			return { voteItems: newItems };
		}),

	setIsDuplicated: (value) => {
		console.log('중복 선택 설정:', value);
		set({ isDuplicated: value });
	},

	deleteVoteItem: (id) =>
		set((state) => {
			const newItems = state.voteItems.filter((item) => item.id !== id);
			console.log('항목 삭제 후:', newItems);
			return { voteItems: newItems };
		}),

	setIsSave: (isSave: boolean) => {
		console.log('저장 상태 변경:', isSave);
		set({ isSave });
	},

	setSelectedVoteId: (fn) =>
		set((state) => {
			const newSelected = fn(state.selectedVoteId);
			console.log('선택된 투표 ID 업데이트:', newSelected);
			return { selectedVoteId: newSelected };
		}),

	setIsTimerActive: (active) => {
		console.log('타이머 활성 상태:', active);
		set({ isTimerActive: active });
	},

	setCurrentUserId: (userId) => {
		console.log('현재 사용자 ID 설정:', userId);
		set({ currentUserId: userId });
	},

	isVoteCreator: () => {
		const { voteCreatorId, currentUserId } = get();
		return voteCreatorId !== null && currentUserId !== null && voteCreatorId === currentUserId;
	},

	endVote: () => {
		console.log('투표 종료');
		set({
			isTimerActive: false,
			isVoteEnded: true
		});
	},

	resetVote: () => {
		console.log('투표 상태 초기화');
		set({
			title: "",
			voteItems: [
				{ id: Date.now(), text: "", count: 0 },
				{ id: Date.now() + 1, text: "", count: 0 },
			],
			isSave: false,
			isDuplicated: false,
			selectedVoteId: [],
			isTimerActive: false,
			isVoteEnded: false,
			voteCreatorId: null,
		});
	},

	updateFromServer: (data) => {
		console.log('서버에서 받은 투표 데이터 업데이트:', data);
		set({
			title: data.title,
			voteItems: data.items.map(item => ({
				id: item.itemId,
				text: item.text,
				count: item.count
			})),
			isDuplicated: data.isMultiple,
			isSave: data.isActive,
			isTimerActive: data.isActive && !data.isEnded,
			isVoteEnded: data.isEnded,
			voteCreatorId: data.userId || null
		});
	},

	isVote: (id) => {
		const { isDuplicated, setSelectedVoteId} = get();

		console.log('투표 항목 선택:', id, '중복 선택:', isDuplicated);

		if (isDuplicated) {
			setSelectedVoteId((prev) =>
				prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
			);
		} else {
			setSelectedVoteId(() => [id]);
		}
	},
	setVoteCreatorId: (userId:number) => set({ voteCreatorId: userId}),
}));