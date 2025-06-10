import styled from "@emotion/styled";

export const ChatUserMessageContainer = styled.div(({ theme }) => ({
  color: theme.color.black,
  fontSize: theme.fontSize.s, 
  display: 'block',
  width: 'fit-content',
  padding: '0.75rem 1rem',
  backgroundColor: theme.color.chatBlue,  
  borderRadius: theme.borderRadius.s,
  maxWidth: '70%',
  margin: '0.25rem 0',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  wordBreak: 'break-word',
}));

export const MessageWrapper = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
}));

export const SenderLabel = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.xs,
  color: theme.color.gray50,
}));

export const BubbleRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  gap: '0.4rem',
}));

export const TimeLabel = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.xs,
  color: theme.color.gray50,
  marginBottom: '0.1rem',
}));