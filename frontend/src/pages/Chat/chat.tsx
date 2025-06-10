import SystemMessage from "@/components/systemMessage/SystemMessage";
import { ChatMessageList } from "./chat.style";
import ChatSystemMessage from "@/components/systemMessage/chatSystemMessage/chatSystemMessage";

// import {useUserStore} from "@/store/useUserStore";
// import {useChatStore} from "@/store/useChatStore";
// import SystemMessage from "@/components/systemMessage/SystemMessage";

// const Chat = () => {
// 	const userMessages = useUserStore((state) => state.message);
// 	const systemMessages = useChatStore((state) => state.systemMessages);

// 	const combinedMessages = [
// 		...userMessages.map((msg) => ({
// 			type: "user" as const,
// 			time: msg.time,
// 			message: msg,
// 		})),
// 		...systemMessages.map((msg) => ({
// 			type: "system" as const,
// 			time: msg.time,
// 			message: msg,
// 			items: msg.items,
// 		})),
// 	];

// 	const sortedMessages = combinedMessages.sort(
// 		(a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
// 	);
// 	return (
// 		<>
// 			<div>채팅 - 서버반영테스트2</div>
// 			{sortedMessages.map((msg, index) => {
// 				if (msg.type === "user") {
// 					return (
// 						<ChatSystemMessage key={index} message={msg.message.content} />
// 					);
// 				} else {
// 					return (
// 						<SystemMessage
// 							items={msg.message.items}
// 							key={index}
// 							type={msg.message.type}
// 							nickName={msg.message.nickName}
// 							time={msg.message.time}
// 						/>
// 					);
// 				}
// 			})}
// 		</>
// 	);

import BubbleHeader from "@/pageHeader/pageHeader";
import { useChatStore } from "@/store/useChatStore";
import { useQuizStore } from "@/store/useQuizStore";
import { useUserStore } from "@/store/useUserStore";
import ChatUserMessage from "@/components/systemMessage/chatUserMessage/chatUserMessage";

const Chat = () => {
  const { question, isActive } = useQuizStore();
  const { headerType } = useUserStore();
  const { systemMessages } = useChatStore();

  const headerQuestion = isActive && question ? question : "";

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  // const message = useUserStore((state) => state.message);

  const userMessages = useUserStore((state) => state.userMessages);
  const chatSystemMessages = useUserStore((state) => state.systemMessages);



  return (
    <>
      {headerType === "quiz" && (
        <BubbleHeader
          type="quiz"
          question={headerQuestion}
          time={getCurrentTime()}
        />
      )}

      {chatSystemMessages.map((msg, idx) => (
        <ChatSystemMessage key={idx} message={msg} />
        
      ))}

      {systemMessages.map((msg, index) => {
        console.log(msg);

        return(
          <SystemMessage
            key={index}
            type={msg.type}
            nickName={msg.nickName}
            time={msg.time}
            items={msg.items}
          />
          )
        


      })}

      <ChatMessageList>
        {userMessages.map((msg, idx) => (
          <ChatUserMessage key={idx} message={msg} />
        ))}
        
      </ChatMessageList>

      
    </>
  );
};

export default Chat;