import * as S from "./chatSystemMessage.style";
import React from "react";

interface ChatSystemMessageProps {
	message:string;
}
const chatSystemMessage:React.FC<ChatSystemMessageProps> = ({message})=>{
	return (
		<S.ChatSystemMessageContainer>{message}</S.ChatSystemMessageContainer>
	)
}
export default chatSystemMessage