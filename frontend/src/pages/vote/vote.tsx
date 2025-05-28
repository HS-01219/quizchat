
import BubbleHeader from "@/components/bubbleHeader/bubbleHeader";
import VoteCard from "@/components/vote/voteCard";
import {Label} from "@/constants/label";
import { useModalStore } from "@/store/useModalStore";
import * as S from "@/pages/vote/vote.style"
const Vote = () => {
	const { isOpenModal, openModal,closeModal } = useModalStore();

	return (
		<>
			<BubbleHeader type="vote" question="이것은 투표내용 아직 없다" time="00:30" />
			{isOpenModal.vote && <VoteCard />}

			{isOpenModal.vote ?	<S.VoteStartText onClick={() => closeModal("vote")}>닫기</S.VoteStartText>:	<S.VoteStartText onClick={() => openModal("vote")}>{Label.VOTE_START}</S.VoteStartText>}
		</>
	);
};
export default Vote;