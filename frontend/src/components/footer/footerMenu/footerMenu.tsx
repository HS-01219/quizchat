import { FiUser } from "react-icons/fi";
import { RiFileListLine } from "react-icons/ri";
import * as S from "@/components/footer/footerMenu/footerMenu.style";
import {LABEL} from "@/constants/Label";

const FooterMenu = () => {
	return (
<S.FooterMenuContainer>
	<S.FooterMenuWrapper>	<RiFileListLine/>
		<S.FooterMenuLabel>	{LABEL.VOTE}</S.FooterMenuLabel>
	</S.FooterMenuWrapper>
<S.FooterMenuWrapper>
	<FiUser/>
	<S.FooterMenuLabel>
		{LABEL.QUIZ}
	</S.FooterMenuLabel>
</S.FooterMenuWrapper>




</S.FooterMenuContainer>
	);
};
export default FooterMenu;