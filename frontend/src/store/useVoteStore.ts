import { create } from "zustand";

interface VoteItem {
	id: number;
	text: string;
}

interface VoteState {
	title: string;
	voteItems: VoteItem[];
	isSave: boolean;
	setTitle: (title: string) => void;
	setVoteItems: (itemsOrUpdater: VoteItem[] | ((prev: VoteItem[]) => VoteItem[])) => void;
	addVoteItem: () => void;
	deleteVoteItem: (id: number) => void;
	setIsSave: (state: boolean) => void;
	resetVote: () => void;
	isDuplicated:boolean;
	setIsDuplicated: (state: boolean) => void;
}

export const useVoteStore = create<VoteState>((set, get) => ({
	title: "",
	voteItems: [
		{ id: Date.now(), text: "" },
		{ id: Date.now() + 1, text: "" },
	],
	isSave: false,
	setTitle: (title: string) => set({ title }),
	setVoteItems: (itemsOrUpdater) =>
		set((state) => ({
			voteItems:
				typeof itemsOrUpdater === "function"
					? itemsOrUpdater(state.voteItems)
					: itemsOrUpdater,
		})),
	addVoteItem: () => {
		if (get().isSave) return;
		set((state) => ({
			voteItems: [...state.voteItems, { id: Date.now(), text: "" }],
		}));
	},
	deleteVoteItem: (id: number) => {
		if (get().isSave || get().voteItems.length <= 2) return;
		set((state) => ({
			voteItems: state.voteItems.filter((item) => item.id !== id),
		}));
	},
	setIsSave: (isSave: boolean) => set({ isSave }),
	resetVote: () =>
		set({
			title: "",
			voteItems: [
				{ id: Date.now(), text: "" },
				{ id: Date.now() + 1, text: "" },
			],
			isSave: false,
		}),
	isDuplicated: false,
	setIsDuplicated: (value) => set({ isDuplicated: value }),
}));