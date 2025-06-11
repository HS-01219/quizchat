import { create } from "zustand";
import {QuizItem, QuizState} from "@/common/types";

interface QuizStore {
  question: string;
  isActive: boolean;
  winnerNickName: string;
  correctAnswer: string;
  showQuizQuestion: (question: string) => void;
  hideQuizQuestion: () => void;
  setQuizResult: (winnerNickName: string, correctAnswer: string) => void;
  resetQuiz: () => void;


  quizState: QuizState | null;
  quizItems: QuizItem;
  setQuizState: (newState: QuizState) => void;
  setQuizItems: (items: QuizItem) => void;

}

export const useQuizStore = create<QuizStore>((set) => ({
  question: "",
  quizState: null,
  isActive: false,
  winnerNickName: "",
  correctAnswer: "",
  showQuizQuestion: (question) => set({ question, isActive: true }),
  hideQuizQuestion: () => set({ question: "", isActive: false }),
  setQuizResult: (winnerNickName, correctAnswer) => set({
    winnerNickName,
    correctAnswer,
    isActive: false,
    question: "",
  }),
  resetQuiz: () => set({
    question: "",
    isActive: false,
    winnerNickName: "",
    correctAnswer: "",
  }),



  quizItems:{ id: 0, question: "", answer: "" },
  setQuizState: (newState: QuizState) => {
    set({ quizState: newState });
  },
  setQuizItems: (items: QuizItem) => {
    set({ quizItems: items });
  }

}));