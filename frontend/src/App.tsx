import React from "react";
import { GlobalStyle } from "@/styles/global";
import { Global } from "@emotion/react";
import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme";
import { Outlet } from "react-router-dom";
import Layout from "@/components/layout/layout";
import UserNameChange from "@/components/modal/userNameChange/userNameChange";
import {useAuth} from "@/hooks/useAuth"

const App: React.FC = () => {
  const { isOpenModal, handleSave } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <Global styles={GlobalStyle} />
      <Layout>
        <Outlet />
        {isOpenModal.nickName && (
          <UserNameChange onSave={handleSave} />
        )}
      </Layout>
    </ThemeProvider>
  );
};

export default App;