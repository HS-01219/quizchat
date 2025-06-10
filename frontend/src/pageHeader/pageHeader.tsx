

import React, { useState } from "react";
import * as S from "@/pageHeader/pageHeader.style";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "@/components/button/button";
import CountDown from "@/components/countdown/countDown";
import { useModalStore } from "@/store/useModalStore";
import { useVoteStore } from "@/store/useVoteStore";
import { useVoteHandler } from "@/socket/voteHandler";

import {useTimerStore} from "@/store/useTimerStore";




interface BubbleHeaderProps {
	type: "quiz" | "vote";
	question: string;
	hasVote?: boolean;
	time?: string;
}

const BubbleHeader: React.FC<BubbleHeaderProps> = ({
	                                                   type,
	                                                   question,
	                                                   hasVote = false,
                                                   }) => {
	const [expanded, setExpanded] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const { openModal } = useModalStore();
	const {
	voteState,
		setIsTimerActive,
		resetVote,
		isVoteCreator,
		voteItems
	} = useVoteStore();
	const isCreator = isVoteCreator();
	const { resetTimer } = useTimerStore();
	const { endVote } = useVoteHandler();


	const handleVoteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		openModal("vote");

	};

	const handleEndVoteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsTimerActive(false);
		endVote(voteItems);
		resetVote();


		resetTimer()
setShowResult(true);
	};

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

					{hasVote && !voteState.isEnded && <CountDown />}
				</S.QuestionSection>

				<S.ToggleIcon>
					{expanded ? <FiChevronUp /> : <FiChevronDown />}
				</S.ToggleIcon>
			</S.ContentRow>

			{expanded && (
				<S.ButtonContainer>
					{hasVote && (
						<S.VoteButtonGroup>
							<Button onClick={handleVoteClick}>투표하기</Button>
							{!voteState.isEnded && isCreator&& (
								<Button onClick={handleEndVoteClick}>투표 종료</Button>
							)}
						</S.VoteButtonGroup>
					)}
				</S.ButtonContainer>
			)}
			{/*{showResult && voteItems.length > 0 && (*/}
			{/*	<VoteResult items={voteItems} />*/}
			{/*)}*/}
		</S.BalloonContainer>
	);
};

export default BubbleHeader;