
import BubbleHeader from "@/components/bubbleHeader/bubbleHeader";
import VoteCard from "@/components/vote/voteCard";
import { useModalStore } from "@/store/useModalStore";
import {useVoteStore} from "@/store/useVoteStore";
import Chat from "@/pages/Chat/chat";
import {useVoteHandler} from "@/socket/voteHandler";

const Vote = () => {
	const { isOpenModal } = useModalStore();
	const {title} = useVoteStore();
	useVoteHandler();
	const VoteHeader=title.trim()?title:"생성된 투표가 없습니다"
	return (
		<>
			<BubbleHeader type="vote" question={VoteHeader} hasVote={!!title.trim()}/>
			{isOpenModal.vote && <VoteCard />}
			<Chat/>
		</>
	);
};
export default Vote;