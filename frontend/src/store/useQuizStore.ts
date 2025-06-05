import { create } from "zustand";

interface QuizStore {
  question: string;
  isActive: boolean;
  winnerNickName: string;
  correctAnswer: string;

  showQuizQuestion: (question: string) => void;
  hideQuizQuestion: () => void;
  setQuizResult: (winnerNickName: string, correctAnswer: string) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  question: "",
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
}));