// 유저 관련 시스템 메시지 (입장/퇴장 시스템 메시지, 유저가 보낸 메시지)

import { create } from "zustand";

interface ChatMessage {
  content: string;
  sender?: string;
  time: string;
  userId?: number;
}

interface UserState {
  nickName: string;
  userId: number;
  justJoined: boolean;
  message: ChatMessage[];
  userMessages: ChatMessage[];
  systemMessages: ChatMessage[];
  currentUsers: number;
  headerType: "default" | "quiz" | "vote";
  setUserId: (userId: number) => void;
  setCurrentUsers: (currentUsers: number) => void;
  setNickName: (name: string) => void;
  setJustJoined: (joined: boolean) => void;
  setUserMessage: (msg: string, sender: string, userId:number) => void;
  setSystemMessage: (msg: string) => void;
  setHeaderType: (type: "default" | "quiz" | "vote") => void;
  updateSenderNickName: (userId: number, newNickName: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickName: "",
  justJoined: false,
  message: [],
  userMessages: [],
  systemMessages: [],
  userId: 0,
  currentUsers: 0,
  headerType: "default",

  setUserId: (id: number) => set({ userId: id }),
  setCurrentUsers: (currentUsers: number) =>
    set({ currentUsers: currentUsers }),
  setNickName: (name) => set({ nickName: name }),
  setJustJoined: (joined) => set({ justJoined: joined }),

  setUserMessage: (msg, sender,userId) =>
    set((state) => ({
      userMessages: [
        ...state.userMessages,
        {
          content: msg,
          sender,
          userId,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    })),

  setSystemMessage: (msg) =>
    set((state) => ({
      systemMessages: [
        ...state.systemMessages,
        {
          content: msg,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    })),
  setHeaderType: (type) => set({ headerType: type }),
  updateSenderNickName: (userId: number, newNickName: string) =>
    set((state) => ({
      userMessages: state.userMessages.map((msg) =>
        msg.userId === userId
          ? { ...msg, sender: newNickName }
          : msg
      ),
      message: state.message.map((msg) =>
        msg.userId === userId
          ? { ...msg, sender: newNickName }
          : msg
      ),
    })),
}))