import { useUserStore } from "@/store/useUserStore";
import {useEffect, useRef, useState} from "react";
import ChatSystemMessage from "@/components/systemMessage/chatSystemMessage/chatSystemMessage";
const Chat = () => {
	const { nickName, justJoined, setJustJoined } = useUserStore();
	const [prevNickName, setPrevNickName] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		if (justJoined) {
			setMessage(`'${nickName}' 님이 입장하셨습니다.`);
			setPrevNickName(nickName);
			setJustJoined(false);
			return;
		}

		if (prevNickName && nickName !== prevNickName) {
			setMessage(`'${prevNickName}'이(가) '${nickName}'으로 변경되었습니다.`);
			setPrevNickName(nickName);
		}
	}, [nickName, justJoined]);

	return (
		<>
			<div>채팅</div>
			{message && <ChatSystemMessage message={message} />}
		</>
	);
};

export default Chat;