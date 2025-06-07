import {create} from 'zustand'
import type {QuizState,VoteState} from "@/common/types";

interface RoomState{
	quizState: QuizState;
	voteState: VoteState;
	setQuizState: (state: QuizState) => void;
	setVoteState: (state: VoteState) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
quizState:{isActive:false,quizData:null},
	voteState: { isActive: false, userId: 0, title: '', items: [], isMultiple: false },
	setQuizState: (quizState) => set({ quizState}),
	setVoteState:(voteState) => set({ voteState}),
}));