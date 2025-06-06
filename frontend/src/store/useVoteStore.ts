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
}

export const useVoteStore = create<VoteStore>((set, get) => ({
	title: "",
	voteItems: [
		{ id: Date.now(), text: "" , count: 0 },
		{ id: Date.now() + 1, text: "" , count: 0 },
	],
	isSave: false,
	isDuplicated: false,
	selectedVoteId: [],
	isTimerActive: false,
	isVoteEnded: false,

	setTitle: (title) => set({ title }),
	setVoteItems: (fn) =>
		set((state) => ({ voteItems: fn(state.voteItems) })),
	setIsDuplicated: (value) => set({ isDuplicated: value }),
	deleteVoteItem: (id) =>
		set((state) => ({
			voteItems: state.voteItems.filter((item) => item.id !== id),
		})),
	setIsSave: (isSave: boolean) => set({ isSave }),
	setSelectedVoteId: (fn) =>
		set((state) => ({ selectedVoteId: fn(state.selectedVoteId) })),
	setIsTimerActive: (active) => set({ isTimerActive: active }),

	endVote: () => set({
		isTimerActive: false,
		isVoteEnded: true
	}),


	resetVote: () => set({
		title: "",
		voteItems: [
			{ id: Date.now(), text: "" , count:0},
			{ id: Date.now() + 1, text: "" ,count:0},
		],
		isSave: false,
		selectedVoteId: [],
		isTimerActive: false,
		isVoteEnded: false,
	}),

	isVote: (id) => {
		const {  isDuplicated, setSelectedVoteId } = get();
		if (isDuplicated) {
			setSelectedVoteId((prev) =>
				prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
			);
		} else {
			setSelectedVoteId(() => [id]);
		}
	},
}));