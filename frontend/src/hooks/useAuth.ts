import {useUserStore} from "@/store/useUserStore";
import {useUserHandler} from "@/socket/userHandler";
import {useModalStore} from "@/store/useModalStore";
import {useEffect, useState} from "react";

export const useAuth=()=>{
	const { nickName, setNickName } = useUserStore();
	const { requestJoinRoom, updateNickName } = useUserHandler();
	const { closeModal, openModal,isOpenModal } = useModalStore();
	const [isInitial, setIsInitial] = useState(true);

	useEffect(() => {
		if (!nickName) {
			localStorage.removeItem("nickName");
			localStorage.removeItem("userId");
			setNickName("");
			setIsInitial(true);
			openModal("nickName");
		}
	}, [nickName, setNickName, openModal]);

	const handleSave = (nickName:string)=>{
		const trimmedNick=nickName.trim();
		if(!trimmedNick) return;

		setNickName(trimmedNick);

		const actions ={
			initial:()=>{
				requestJoinRoom(trimmedNick);
				setIsInitial(false)
			},
			update:()=>{
				updateNickName({nickName:trimmedNick})
			},
		}
		const actionKey= isInitial?"initial":"update";
		actions[actionKey]();
		closeModal("nickName");
	}
	return{isOpenModal,handleSave}
}