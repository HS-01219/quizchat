// import { create } from "zustand";
//
// interface VoteItem {
// 	id: number;
// 	text: string;
// 	count?: number;
// }
//
// interface VoteState {
// 	title: string;
// 	voteItems: VoteItem[];
// 	isSave: boolean;
// 	setTitle: (title: string) => void;
// 	setVoteItems: (itemsOrUpdater: VoteItem[] | ((prev: VoteItem[]) => VoteItem[])) => void;
// 	addVoteItem: () => void;
// 	deleteVoteItem: (id: number) => void;
// 	setIsSave: (state: boolean) => void;
// 	resetVote: () => void;
// 	isDuplicated:boolean;
// 	setIsDuplicated: (state: boolean) => void;
//
// 	isVote: (id: number) => void;
// 	setSelectedVoteId: (fn: (prev: number[]) => number[]) => void;
// }
//
// export const useVoteStore = create<VoteState>((set, get) => ({
// 	title: "",
// 	voteItems: [
// 		{ id: Date.now(), text: "" },
// 		{ id: Date.now() + 1, text: "" },
// 	],
// 	isSave: false,
// 	setTitle: (title: string) => set({ title }),
// 	setVoteItems: (itemsOrUpdater) =>
// 		set((state) => ({
// 			voteItems:
// 				typeof itemsOrUpdater === "function"
// 					? itemsOrUpdater(state.voteItems)
// 					: itemsOrUpdater,
// 		})),
// 	addVoteItem: () => {
// 		if (get().isSave) return;
// 		set((state) => ({
// 			voteItems: [...state.voteItems, { id: Date.now(), text: "" }],
// 		}));
// 	},
// 	deleteVoteItem: (id: number) => {
// 		if (get().isSave || get().voteItems.length <= 2) return;
// 		set((state) => ({
// 			voteItems: state.voteItems.filter((item) => item.id !== id),
// 		}));
// 	},
// 	setIsSave: (isSave: boolean) => set({ isSave }),
// 	resetVote: () =>
// 		set({
// 			title: "",
// 			voteItems: [
// 				{ id: Date.now(), text: "" },
// 				{ id: Date.now() + 1, text: "" },
// 			],
// 			isSave: false,
// 		}),
// 	selectedVoteId: null,
// 	isDuplicated: false,
//
// }));

import { create } from "zustand";

interface VoteItem {
	id: number;
	text: string;
}

interface VoteStore {
	title: string;
	voteItems: VoteItem[];
	isSave: boolean;
	isDuplicated: boolean;
	selectedVoteId: number[];
	setIsSave: (state: boolean) => void;
	setTitle: (title: string) => void;
	setVoteItems: (fn: (prev: VoteItem[]) => VoteItem[]) => void;
	setIsDuplicated: (value: boolean) => void;
	deleteVoteItem: (id: number) => void;
	setSelectedVoteId: (fn: (prev: number[]) => number[]) => void;
	isVote: (id: number) => void;
}

export const useVoteStore = create<VoteStore>((set, get) => ({
	title: "",
	voteItems: [
		{ id: Date.now(), text: "" },
		{ id: Date.now() + 1, text: "" },
	],
	isSave: false,
	isDuplicated: false,
	selectedVoteId: [],

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
	isVote: (id) => {
		const {isDuplicated, setSelectedVoteId } = get();
		if (isDuplicated) {
			setSelectedVoteId((prev) =>
				prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
			);
		} else {
			setSelectedVoteId(() => [id]);
		}
	},
}));