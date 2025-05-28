import React, { useState } from "react";
import * as S from "./bubbleHeader.style"; 
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "../button/button";

interface BubbleHeaderProps {
  type: "quiz" | "vote";
  question: string;
  time: string;
}

const BubbleHeader: React.FC<BubbleHeaderProps> = ({
  type,
  question,
  time,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <S.BalloonContainer onClick={() => setExpanded(!expanded)}>
      <S.ContentRow expanded={expanded}>

        <S.QuestionSection>
          {type === "quiz" ? <S.QLabel>Q</S.QLabel> : <S.VoteIcon />}

          {expanded ? (
            <S.QuestionTextExpanded>{question}</S.QuestionTextExpanded>
          ) : (
            <S.QuestionText title={question}>{question}</S.QuestionText>
          )}

          <S.TimeText>{time}</S.TimeText>
        </S.QuestionSection>

        <S.ToggleIcon>
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </S.ToggleIcon>
        
      </S.ContentRow>

      {expanded && <Button />}
    </S.BalloonContainer>
  );
};

export default BubbleHeader;
