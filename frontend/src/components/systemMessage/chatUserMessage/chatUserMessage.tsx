import * as S from "./chatUserMessage.style";
import React from "react";

interface ChatUserMessageProps {
  message: {
    content: string;
    sender?: string;
   userId?: number;
    time: string;
  };
}

const ChatUserMessage: React.FC<ChatUserMessageProps> = ({ message }) => {

  return (
    <S.MessageWrapper>
      <S.SenderLabel>{message.sender}</S.SenderLabel>
      <S.BubbleRow>
        <S.TimeLabel>{message.time}</S.TimeLabel>
        <S.ChatUserMessageContainer>
          {message.content}
        </S.ChatUserMessageContainer>
      </S.BubbleRow>
    </S.MessageWrapper>
  );
};

export default ChatUserMessage;