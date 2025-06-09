import { create } from "zustand";

interface ChatMessage {
  content: string;
  sender: string;
  time: string;
}

interface UserState {
  nickName: string;
  userId: number;
  justJoined: boolean;
  message: ChatMessage[];
  currentUsers: number;
  headerType: "default" | "quiz" | "vote";
  setUserId: (userId: number) => void;
  setCurrentUsers: (currentUsers: number) => void;
  setNickName: (name: string) => void;
  setJustJoined: (joined: boolean) => void;
  setMessage: (msg: string, sender: string) => void;
  setHeaderType: (type: "default" | "quiz" | "vote") => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickName: "",
  justJoined: false,
  message: [],
  userId: 0,
  currentUsers: 0,
  headerType: "default",

  setUserId: (id: number) => set({ userId: id }),
  setCurrentUsers: (currentUsers: number) =>
    set({ currentUsers: currentUsers }),
  setNickName: (name) => set({ nickName: name }),
  setJustJoined: (joined) => set({ justJoined: joined }),

  setMessage: (msg, sender) =>
    set((state) => ({
      message: [
        ...state.message,
        {
          content: msg,
          sender,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    })),
     setHeaderType: (type) => set({ headerType: type }),

}));
