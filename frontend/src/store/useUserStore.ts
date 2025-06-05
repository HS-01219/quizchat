
import { create } from "zustand";

interface UserState {
	nickName: string;
	userId:string;
	justJoined: boolean;
	message: string[];
currentUsers:number;
setUserId: (userId: string) => void;
setCurrentUsers: (currentUsers: number) => void;
	setNickName: (name: string) => void;
	setJustJoined: (joined: boolean) => void;
	setMessage: (msg: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
	nickName: "",
	justJoined: false,
	message: [],
	userId:'',
	currentUsers:0,
	setUserId: (id: string) => set({ userId: id }),

	setCurrentUsers:(currentUsers: number) => set({ currentUsers : currentUsers }),
	setNickName: (name) => set({ nickName: name }),
	setJustJoined: (joined) => set({ justJoined: joined }),
	setMessage: (msg) => set((state)=>({ message: [...state.message,msg] })),
}));