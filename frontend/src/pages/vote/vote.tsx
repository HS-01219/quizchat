
import BubbleHeader from "@/components/bubbleHeader/bubbleHeader";
import VoteCard from "@/components/vote/voteCard";
import {useModal} from "@/hooks/useModal";

const Vote = () => {
  return (
    	<>
    <BubbleHeader type="vote" question="이것은 투표내용 아직 없다" time="00:30" />
   
			{isOpenModal.vote && (
				<VoteCard/>
			)}
      
		</>
  );
};
export default Vote;

