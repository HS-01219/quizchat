import styled from "@emotion/styled";

export const BalloonContainer = styled.div(({ theme }) => ({
  position: "relative",
  padding: "1rem",
  backgroundColor: "white",
  borderRadius: theme.borderRadius.x,
  border: "1px solid #DDE3EB",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  cursor: "pointer",
  userSelect: "none",
  maxWidth: "600px",
  width: "90%",
  display: "flex",
  flexDirection: "column",
  margin: "1rem auto",
}));

export const ContentRow = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const QuestionSection = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flex: 1,
  overflow: "hidden",
});

export const QLabel = styled.span(({ theme }) => ({
  fontWeight: "bold",
  fontSize: theme.fontSize.md,
  color: theme.color.darkblue,
  flexShrink: 0,
}));

export const QuestionText = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.s,
  fontWeight: 500,
  color: theme.color.black,
  lineHeight: 1.4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
}));

export const QuestionTextExpanded = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.s,
  fontWeight: 500,
  color: theme.color.black,
  lineHeight: 1.4,
  whiteSpace: "normal",
  flex: 1,
}));

export const TimeText = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.sm,
  color: theme.color.gray50,
  marginLeft: "1rem",
  flexShrink: 0,
}));

export const ToggleIcon = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.lg,
  color: theme.color.darkblue,
  flexShrink: 0,
}));
