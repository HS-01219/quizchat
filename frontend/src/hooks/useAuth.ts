import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useModalStore } from "@/store/useModalStore";
import { useUserHandlers} from "@/socket/userHandler";

export const useAuth = () => {
	const { nickName, setNickName, setJustJoined, setMessage} = useUserStore();
	const { requestJoinRoom} = useUserHandlers();
	const { closeModal, openModal, isOpenModal } = useModalStore();

	const [isInitial, setIsInitial] = useState(true);
	const [prevNickName, setPrevNickName] = useState<string>("");

	useEffect(() => {
		if (!nickName) {
			localStorage.removeItem("nickName");
			localStorage.removeItem("userId");
			setNickName("");
			setIsInitial(true);
			openModal("nickName");
		}
	}, [nickName]);

	const handleSave = (nickName: string) => {
		const trimmedNick = nickName.trim();
		if (!trimmedNick) return;

		if (isInitial) {
			setNickName(trimmedNick);
			setPrevNickName(trimmedNick);
			requestJoinRoom({ nickName: trimmedNick });
			setJustJoined(true);
			setIsInitial(false);

		}else {
			setNickName(trimmedNick);
			setPrevNickName(trimmedNick);
			setMessage(`'${prevNickName}' 님이 '${trimmedNick}' 님으로 이름이 변경되었습니다.`);
		}

		closeModal("nickName");
	};

	return { isOpenModal, handleSave, openModal };
};