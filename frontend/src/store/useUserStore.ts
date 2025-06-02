
import { create } from 'zustand'

interface UserStore {
	nickName: string;
	setNickName: (name: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
	nickName: "",
	setNickName: (name) => {
		localStorage.setItem('nickName', name);
		set({ nickName: name });
	},
}));