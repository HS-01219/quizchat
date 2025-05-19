import React from 'react';
import * as S from "@/components/layout/layout.style"
import Header from "@/components/layout/header/header"
import Footer from "@/components/layout/footer/footer";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<S.LayoutWrapper>
			<Header />
			<S.LayoutContainer>
				{children}
			</S.LayoutContainer>
			<Footer />
		</S.LayoutWrapper>
	);
};

export default Layout;