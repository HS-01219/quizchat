// Footer.tsx
import * as S from "@/components/footer/footer.style";
import FooterInput from "@/components/footer/footerInput/footerInput";
import FooterUserName from "@/components/footer/footerUserName/footerUserName";
import { useState } from "react";
import FooterMenu from "@/components/footer/footerMenu/footerMenu";

const Footer = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (

		<S.FooterContainer isExpanded={isExpanded}>
			<FooterUserName children={"척척박사 정진영"} />
			<FooterInput isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
			{isExpanded && <FooterMenu/>}
		</S.FooterContainer>
	);
};

export default Footer;