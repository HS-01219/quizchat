import { FiUser } from "react-icons/fi";
import { RiFileListLine } from "react-icons/ri";
import * as S from "@/components/footer/footerMenu/footerMenu.style";
import {LABEL} from "@/constants/Label";
import {useNavigate} from "react-router-dom";
const FooterMenu = () => {
	const nav=useNavigate();
	const handleVoteClick = () => {
		nav("/vote");
	}
	const handleQuizClick = () => {
	nav("/quiz");
	}
	return (
<S.FooterMenuContainer>
	<S.FooterMenuWrapper>	<RiFileListLine onClick={handleVoteClick} />
		<S.FooterMenuLabel>	{LABEL.VOTE}</S.FooterMenuLabel>
	</S.FooterMenuWrapper>
<S.FooterMenuWrapper>
	<FiUser onClick={handleQuizClick} />
	<S.FooterMenuLabel>
		{LABEL.QUIZ}
	</S.FooterMenuLabel>
</S.FooterMenuWrapper>
</S.FooterMenuContainer>
	);
};
export default FooterMenu;