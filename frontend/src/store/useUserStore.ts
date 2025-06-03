//
// import { create } from 'zustand'
//
// interface UserStore {
// 	nickName: string;
// 	setNickName: (name: string) => void;
// }
//
// export const useUserStore = create<UserStore>((set) => ({
// 	nickName: "",
// 	setNickName: (name) => {
// 		localStorage.setItem('nickName', name);
// 		set({ nickName: name });
// 	},
// }));
// useUserStore.ts
import { create } from "zustand";

interface UserState {
	nickName: string;
	justJoined: boolean;
	setNickName: (name: string) => void;
	setJustJoined: (joined: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
	nickName: "",
	justJoined: false,
	setNickName: (name) => set({ nickName: name }),
	setJustJoined: (joined) => set({ justJoined: joined }),
}));