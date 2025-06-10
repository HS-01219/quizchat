import { create } from "zustand";


// interface UserMessage {
// 	content: string;
// 	time: string;
// }

// interface UserState {
// 	nickName: string;
// 	userId:number;
// 	justJoined: boolean;
// 	message: UserMessage[];
// 	currentUsers:number;

// 	setUserId: (userId: number) => void;
// 	setCurrentUsers: (currentUsers: number) => void;
// 	setNickName: (name: string) => void;
// 	setJustJoined: (joined: boolean) => void;
// 	setMessage: (msg: string, now: string) => void;
// }

// export const useUserStore = create<UserState>((set) => ({
// 	nickName: "",
// 	justJoined: false,
// 	message: [],
// 	userId:0,
// 	currentUsers:0,
// 	setUserId: (id: number) => set({ userId: id }),

// 	setCurrentUsers:(currentUsers: number) => set({ currentUsers : currentUsers }),
// 	setNickName: (name) => set({ nickName: name }),
// 	setJustJoined: (joined) => set({ justJoined: joined }),
// 	setMessage: (msg: string, time?: string) =>
// 		set((state) => ({
// 			message: [
// 				...state.message,
// 				{
// 					content: msg,
// 					time: time ?? new Date().toISOString(),
// 				},
// 			],
// 		})),
// }));

interface ChatMessage {
  content: string;
  sender?: string;
  time: string;
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

  setUserMessage: (msg: string, sender: string) => void;
  setSystemMessage: (msg: string) => void;
  setHeaderType: (type: "default" | "quiz" | "vote") => void;
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

  setUserMessage: (msg, sender) =>
    set((state) => ({
      userMessages: [
        ...state.userMessages,
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
}));

