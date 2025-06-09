
import ChatSystemMessage from "@/components/systemMessage/chatSystemMessage/chatSystemMessage";
import {useUserStore} from "@/store/useUserStore";

const Chat = () => {
	const message = useUserStore((state) => state.message);
	return (
		<>
			<div>채팅 - 서버반영테스트2</div>
			{message.map((msg,index)=>(
				<ChatSystemMessage message={msg} key={index} />
				))}
		</>
	);
};

export default Chat;