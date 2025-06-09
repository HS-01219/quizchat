import * as S from "@/components/header/header.style";
import { FiUser } from "react-icons/fi";
import {useUserStore} from "@/store/useUserStore";
// import { useQuizHandler } from "@/socket/quizHandler";


const Header = () => {
  const currentUsers = useUserStore((state) => state.currentUsers);
  // const { requestStartQuiz } = useQuizHandler();

  return (
    <S.HeaderContainer>
      {/* <button onClick={requestStartQuiz}>퀴즈시작</button> */}
      <S.Title>채팅방</S.Title>
      <S.UserInfo>
        <FiUser size={20} />
         <span>{currentUsers}</span>
      </S.UserInfo>
    </S.HeaderContainer>
  );
};

export default Header;