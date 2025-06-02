import React from "react";
import * as S from "./loading.style";
import loadingImg from "@/assets/images/loading.png";

const LoadingPage = () => {
  return (
    <S.Wrapper>
      <S.Spinner src={loadingImg} alt="로딩 중" />
    </S.Wrapper>
  );
};

export default LoadingPage;
