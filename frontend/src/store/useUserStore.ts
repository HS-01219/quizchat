
import { create } from "zustand";

interface UserMessage {
	content: string;
	time: string;
}

interface UserState {
	nickName: string;
	userId:number;
	justJoined: boolean;
	message: UserMessage[];
	currentUsers:number;

	setUserId: (userId: number) => void;
	setCurrentUsers: (currentUsers: number) => void;
	setNickName: (name: string) => void;
	setJustJoined: (joined: boolean) => void;
	setMessage: (msg: string, now: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
	nickName: "",
	justJoined: false,
	message: [],
	userId:0,
	currentUsers:0,
	setUserId: (id: number) => set({ userId: id }),

	setCurrentUsers:(currentUsers: number) => set({ currentUsers : currentUsers }),
	setNickName: (name) => set({ nickName: name }),
	setJustJoined: (joined) => set({ justJoined: joined }),
	setMessage: (msg: string, time?: string) =>
		set((state) => ({
			message: [
				...state.message,
				{
					content: msg,
					time: time ?? new Date().toISOString(),
				},
			],
		})),
}));