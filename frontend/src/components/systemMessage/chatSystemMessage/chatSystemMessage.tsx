import * as S from "./chatSystemMessage.style";
import React from "react";

interface ChatSystemMessageProps {
  message: {
    content: string;
    time: string;
  };
}

const ChatSystemMessage: React.FC<ChatSystemMessageProps> = ({ message }) => {
  return (
    <S.SystemMessageWrapper>
      <S.ChatSystemMessageContainer>
        {message.content}
      </S.ChatSystemMessageContainer>
      <S.TimeLabel>{message.time}</S.TimeLabel>
    </S.SystemMessageWrapper>
  );
};

export default ChatSystemMessage;
