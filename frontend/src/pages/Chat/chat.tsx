import SystemMessage from "@/components/systemMessage/SystemMessage";
import {ChatContainer, ChatMessageList} from "./chat.style";
import ChatSystemMessage from "@/components/systemMessage/chatSystemMessage/chatSystemMessage";
import BubbleHeader from "@/pageHeader/pageHeader";
import { useChatStore } from "@/store/useChatStore";
import { useQuizStore } from "@/store/useQuizStore";
import { useUserStore } from "@/store/useUserStore";
import ChatUserMessage from "@/components/systemMessage/chatUserMessage/chatUserMessage";
import {useEffect, useRef} from "react";

const Chat = () => {
  const { question, isActive } = useQuizStore();
  const { headerType } = useUserStore();
  const { systemMessages } = useChatStore();
  const headerQuestion = isActive && question ? question : "";
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

   const messages = useUserStore((state) => state.message);
  const userMessages = useUserStore((state) => state.userMessages);
  const chatSystemMessages = useUserStore((state) => state.systemMessages);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, userMessages, chatSystemMessages, systemMessages]);
  return (

    <ChatContainer ref={containerRef}>
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

      
    </ChatContainer>
  );
};

export default Chat;