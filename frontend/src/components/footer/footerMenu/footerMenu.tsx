import { FiUser } from "react-icons/fi";
import { RiFileListLine } from "react-icons/ri";
import * as S from "@/components/footer/footerMenu/footerMenu.style";
import { Label } from "@/constants/label";
// import { useQuizHandler } from "@/socket/quizHandler";
import { useModalStore } from "@/store/useModalStore";

import {useVoteStore} from "@/store/useVoteStore";
import { useUserStore } from "@/store/useUserStore";
import {useQuizStore} from "@/store/useQuizStore";

import { requestStartQuiz } from "@/socket/quizHandler";

const FooterMenu = () => {
   const { voteState } = useVoteStore();
   const { quizState }=useQuizStore();
  const { openModal } = useModalStore();
  const { setHeaderType } = useUserStore();


  const handleVoteClick = () => {
    console.log(`[FooterMenu] 현재 voteState:`, voteState);
    const hasActive = (voteState?.isActive && !voteState?.isEnded) || (quizState?.isActive && !quizState?.isEnded);

    if (hasActive) {
      alert("진행 중인 투표 또는 퀴즈가 있습니다.");
      return;
    }

    openModal("vote");
    // const isActiveVote = voteState?.isActive && !voteState?.isEnded;
    // if (isActiveVote) {
    //   console.log("진행 중인 투표가 있습니다. 투표 헤더를 표시합니다.");
    //   openModal("vote");
    // } else {
    //   console.log("진행 중인 투표가 없습니다. 투표 모달을 엽니다.");
    //   openModal("vote");
    // }
  };

  const handleQuizClick = () => {
    const hasActive = (voteState?.isActive && !voteState?.isEnded) || (quizState?.isActive && !quizState?.isEnded);

    if (hasActive) {
      alert("진행 중인 투표 또는 퀴즈가 있습니다.");

      return;
    }
     // setHeaderType("quiz");
    requestStartQuiz();
  };

  return (
    <S.FooterMenuContainer>
      <S.FooterMenuWrapper>
        <RiFileListLine onClick={handleVoteClick} />
        <S.FooterMenuLabel>{Label.VOTE}</S.FooterMenuLabel>
      </S.FooterMenuWrapper>
      <S.FooterMenuWrapper>
        <FiUser onClick={handleQuizClick} />
        <S.FooterMenuLabel>{Label.QUIZ}</S.FooterMenuLabel>
      </S.FooterMenuWrapper>
    </S.FooterMenuContainer>
  );
};

export default FooterMenu;