import styled from "@emotion/styled";

export const FooterUserNameContainer = styled.div(({ theme }) => ({
	display: "flex",
	width: "6.75rem",
	gap:"0.25rem",

	color: theme.color.gray50,
	textAlign: "center",
	alignItems: "center", // 수직 가운데 정렬
	justifyContent: "center", // 수평 가운데 정렬
	fontSize: theme.fontSize.s,
	fontWeight: theme.fontWeight.m,
	margin: "0.63rem",
	svg:{
		color: theme.color.darkblue,
		cursor: "pointer",
	}
}));