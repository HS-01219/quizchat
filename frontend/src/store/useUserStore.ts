import {create} from 'zustand'

interface UserStore {
	nickname: string,
	setNickName: (name: string) => void,
}

export const useUserStore=create<UserStore>(
	(set)=>({
			nickname: localStorage.getItem('nickname') || "",
		setNickName: (name) => {
			localStorage.setItem('nickname', name);
			set({nickname: name});
	},}
))