
import ChatSystemMessage from "@/components/systemMessage/chatSystemMessage/chatSystemMessage";
import {useUserStore} from "@/store/useUserStore";
import {useChatStore} from "@/store/useChatStore";
import SystemMessage from "@/components/systemMessage/SystemMessage";

const Chat = () => {
	const userMessages = useUserStore((state) => state.message);
	const systemMessages = useChatStore((state) => state.systemMessages);

	const combinedMessages = [
		...userMessages.map((msg) => ({
			type: "user" as const,
			time: msg.time,
			message: msg,
		})),
		...systemMessages.map((msg) => ({
			type: "system" as const,
			time: msg.time,
			message: msg,
			items: msg.items,
		})),
	];

	const sortedMessages = combinedMessages.sort(
		(a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
	);
	return (
		<>
			<div>채팅 - 서버반영테스트2</div>
			{sortedMessages.map((msg, index) => {
				if (msg.type === "user") {
					return (
						<ChatSystemMessage key={index} message={msg.message.content} />
					);
				} else {
					return (
						<SystemMessage
							items={msg.message.items}
							key={index}
							type={msg.message.type}
							nickName={msg.message.nickName}
							time={msg.message.time}
						/>
					);
				}
			})}
		</>
	);
};

export default Chat;