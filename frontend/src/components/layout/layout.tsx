import React from 'react';
import * as S from "@/components/layout/layout.style"
import Header from "@/components/header/header"
import Footer from "@/components/footer/footer";
import BubbleHeader from "@/pageHeader/pageHeader";
import { useVoteStore } from "@/store/useVoteStore";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	const { voteState } = useVoteStore();
	const isVoteActive = voteState?.isActive && !voteState?.isEnded;

	return (
		<S.LayoutWrapper>
			<Header />
			<S.LayoutContainer>
				{isVoteActive && (
					<BubbleHeader
						type="vote"
						question={voteState.title}
						hasVote={true}
					/>
				)}
				{children}
			</S.LayoutContainer>
			<Footer />
		</S.LayoutWrapper>
	);
};

export default Layout;