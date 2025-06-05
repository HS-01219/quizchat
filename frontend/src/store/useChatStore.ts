import { create } from "zustand";

type MessageType = "correct" | "voteStart" | "voteEnd" | "warning" | "quizStart" | "quizEnd";

export interface SystemMessage {
  type: MessageType;
  nickName?: string;
  time: string;
}

interface ChatStore {
  systemMessages: SystemMessage[];
  addSystemMessage: (message: SystemMessage) => void;
  clearSystemMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  systemMessages: [],
  addSystemMessage: (message) =>
    set((state) => ({
      systemMessages: [...state.systemMessages, message],
    })),
  clearSystemMessages: () => set({ systemMessages: [] }),
}));
