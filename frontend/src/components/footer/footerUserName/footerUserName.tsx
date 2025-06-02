import * as S from "@/components/footer/footerUserName/footerUserName.style";
import React from "react";
import { PiPencilSimpleLine } from "react-icons/pi";
import {useUserStore} from "@/store/useUserStore";
const FooterUserName = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const {nickname}=useUserStore();
	console.log('리렌더링 된 닉네임:', nickname);
	return (
		<S.FooterUserNameContainer {...props} >
			{nickname} 님
			<PiPencilSimpleLine size={"14"}/>
		</S.FooterUserNameContainer>
	);
};

export default FooterUserName;