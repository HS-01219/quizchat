import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizState, VoteState } from "@/common/types";

interface RoomState {
	quizState: QuizState;
	voteState: VoteState;
	setQuizState: (state: QuizState) => void;
	setVoteState: (state: VoteState) => void;
	updateVoteState: (newState: Partial<VoteState>) => void;
	setVoteActive: () => void;
	setVoteInactive: () => void;
}

export const useRoomStore = create<RoomState>()(
	persist(
		(set) => ({
			quizState: { isActive: false, quizData: null },
			voteState: {
				isActive: false,
				userId: 0,
				title: '',
				items: [],
				isMultiple: false,
				isEnded: false
			},
			setQuizState: (quizState) => set({ quizState }),
			setVoteState: (voteState) => set({ voteState }),
			updateVoteState: (newState) => set((state) => ({
				voteState: { ...state.voteState, ...newState }
			})),
			setVoteActive: () => set((state) => ({
				voteState: { ...state.voteState, isActive: true }
			})),
			setVoteInactive: () => set((state) => ({
				voteState: { ...state.voteState, isActive: false }
			}))
		}),
		{
			name: "room-storage",
			partialize: (state) => ({
				quizState: state.quizState,
				voteState: state.voteState,
			}),
		}
	)
);