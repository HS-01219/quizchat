import SystemMessage from "@/components/systemMessage/SystemMessage";
import { ChatMessageList } from "./chat.style";
import ChatSystemMessage from "@/components/systemMessage/chatSystemMessage/chatSystemMessage";
import BubbleHeader from "@/pageHeader/pageHeader";
import { useChatStore } from "@/store/useChatStore";
import { useQuizStore } from "@/store/useQuizStore";
import { useUserStore } from "@/store/useUserStore";
import ChatUserMessage from "@/components/systemMessage/chatUserMessage/chatUserMessage";

const Chat = () => {
  const { question, isActive } = useQuizStore();
  const { headerType } = useUserStore();
  const { systemMessages } = useChatStore();

  const headerQuestion = isActive && question ? question : "퀴즈가 없습니다";

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  // const message = useUserStore((state) => state.message);

  const userMessages = useUserStore((state) => state.userMessages);
  const chatSystemMessages = useUserStore((state) => state.systemMessages);

  return (
    <>
      {/* <div>채팅 - 서버반영테스트2</div> */}

      {headerType === "quiz" && (
        <BubbleHeader
          type="quiz"
          question={headerQuestion}
          time={getCurrentTime()}
        />
      )}
      {systemMessages.map((msg, index) => (
        <SystemMessage
          key={index}
          type={msg.type}
          nickName={msg.nickName}
          time={msg.time}
        />
      ))}

      {chatSystemMessages.map((msg, idx) => (
        <ChatSystemMessage key={idx} message={msg} />
        
      ))}

      <ChatMessageList>
        {userMessages.map((msg, idx) => (
          <ChatUserMessage key={idx} message={msg} />
        ))}
        
      </ChatMessageList>{" "}

      
    </>
  );
};

export default Chat;
