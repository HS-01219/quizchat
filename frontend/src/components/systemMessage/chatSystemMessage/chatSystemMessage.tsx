import * as S from "./chatSystemMessage.style";
import React from "react";

interface ChatSystemMessageProps {
  message: {
    content: string;
    sender: string;
    time: string;
  };
}

const ChatSystemMessage: React.FC<ChatSystemMessageProps> = ({ message }) => {
  return (
    <S.MessageWrapper>
      <S.SenderLabel>{message.sender}</S.SenderLabel>
      <S.BubbleRow>
        <S.TimeLabel>{message.time}</S.TimeLabel>
        <S.ChatSystemMessageContainer>
          {message.content}
        </S.ChatSystemMessageContainer>
      </S.BubbleRow>
    </S.MessageWrapper>
  );
};

export default ChatSystemMessage;
