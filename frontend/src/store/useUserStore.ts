import { create } from "zustand";

interface ChatMessage {
  content: string;
  sender: string;
  time: string;
}

interface UserState {
<<<<<<< HEAD
  nickName: string;
  userId: number;
  justJoined: boolean;
  message: ChatMessage[];
  currentUsers: number;
  setUserId: (userId: number) => void;
  setCurrentUsers: (currentUsers: number) => void;
  setNickName: (name: string) => void;
  setJustJoined: (joined: boolean) => void;
  setMessage: (msg: string, sender: string) => void;
=======
	nickName: string;
	userId:number;
	justJoined: boolean;
	message: string[];
	currentUsers:number;

	setUserId: (userId: number) => void;
	setCurrentUsers: (currentUsers: number) => void;
	setNickName: (name: string) => void;
	setJustJoined: (joined: boolean) => void;
	setMessage: (msg: string) => void;
>>>>>>> 35116cffe8472f40eca66030d0980147f99f2552
}

export const useUserStore = create<UserState>((set) => ({
  nickName: "",
  justJoined: false,
  message: [],
  userId: 0,
  currentUsers: 0,

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
}));
