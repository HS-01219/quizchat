import * as S from "@/components/footer/footerInput/footerInput.style";
import { BiSend } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { Dispatch, SetStateAction, useState } from "react";
import { useMessageHandler } from "@/socket/messageHandler";

interface FooterInputProps {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

const FooterInput = ({ isExpanded, setIsExpanded }: FooterInputProps) => {
  const [isRotated, setIsRotated] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useMessageHandler();

  const handleClick = () => {
    setIsRotated(!isRotated);
    setIsExpanded(!isExpanded);
  };

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <S.FooterInputContainer>
      <S.IconWrapper>
        <S.RotatingIcon isRotated={isRotated} onClick={handleClick}>
          <FiPlusCircle />
        </S.RotatingIcon>
      </S.IconWrapper>
      <S.FooterInputWrapper>
        <S.FooterInput
          type="text"
          placeholder="메세지를 입력하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <BiSend onClick={handleSend} style={{ cursor: "pointer" }} />
      </S.FooterInputWrapper>
    </S.FooterInputContainer>
  );
};

export default FooterInput;
