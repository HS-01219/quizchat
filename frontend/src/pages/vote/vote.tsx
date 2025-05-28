import VoteCard from "@/components/vote/voteCard";
import {useModal} from "@/hooks/useModal";

const Vote = () => {
	const { isOpenModal } = useModal();
	return (
		<>
			{isOpenModal.vote && (
				<VoteCard/>
			)}


		</>
	)
}
export default Vote;