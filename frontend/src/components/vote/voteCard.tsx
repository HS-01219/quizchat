import * as S from "@/components/vote/voteCard.style";
import CountDown from "@/components/countdown/countDown";
import Content from "@/components/vote/content/content";

const VoteCard=()=>{
		return (
				<S.VoteContainer>
					<S.VoteTitle>투표 하기</S.VoteTitle>
					<S.VoteCountDownWrapper>
					<CountDown/>
	</S.VoteCountDownWrapper>
					<Content/>
				</S.VoteContainer>
		);
}
export default VoteCard;