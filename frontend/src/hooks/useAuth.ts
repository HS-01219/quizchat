import {useUserStore} from "@/store/useUserStore";
import {useUserHandler} from "@/socket/userHandler";
import {useModalStore} from "@/store/useModalStore";
import {useEffect, useState} from "react";

export const useAuth=()=>{
	const { nickName, setNickName, setJustJoined, setMessage, currentUsers ,setCurrentUsers} = useUserStore();
	const { requestJoinRoom, updateNickName, updateUserCnt} = useUserHandler();
	const { closeModal, openModal,isOpenModal } = useModalStore();
	const [isInitial, setIsInitial] = useState(true);

;
	const [prevNickName, setPrevNickName] = useState<string>("");
	useEffect(() => {
		if (!nickName) {
			localStorage.removeItem("nickName");
			localStorage.removeItem("userId");
			setNickName("");
			setIsInitial(true);
			openModal("nickName");
		}
	}, [nickName, setNickName, openModal]);



	const handleSave = (newNickName: string) => {
		const trimmedNick = newNickName.trim();
		if (!trimmedNick) return;

		const actions = {
			initial: () => {
				setNickName(trimmedNick);
				setPrevNickName(trimmedNick);
				requestJoinRoom(trimmedNick);
				setJustJoined(true);
				setCurrentUsers(currentUsers);
				setIsInitial(false);
				setMessage(`'${trimmedNick}' 님이 입장하셨습니다.`);
			},
			update: () => {
				setNickName(trimmedNick);
				updateNickName({ nickName: trimmedNick });
				setPrevNickName(trimmedNick);
				setMessage(`'${prevNickName}' 님이 '${trimmedNick}' 님으로 이름이 변경되었습니다.`);
			},
		};

		const actionKey = isInitial ? "initial" : "update";
		actions[actionKey]();
		closeModal("nickName");
	};
	return { isOpenModal, handleSave, openModal };
}