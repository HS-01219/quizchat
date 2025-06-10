import { create } from "zustand";
import type {VoteItem} from "@/common/types";
type MessageType = "correct" | "voteStart" | "voteEnd" | "warning" | "quizStart" | "quizEnd" |"voteResult";

export interface SystemMessage {
  items?:VoteItem[];
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