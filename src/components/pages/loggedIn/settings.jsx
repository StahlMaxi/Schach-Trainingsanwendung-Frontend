import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const PageContainer = styled.div`
    height: calc(100vh - 60px); 
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${(props) => props.theme.colors.background};
    padding: 50px;
    text-align: center;
`;

const StyledH1 = styled.h1`
    font-size: 2em;
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.h1.fontWeight};
    font-size: ${(props) => props.theme.typography.h1.fontSize};
`;

const StyledH3 = styled.p`
    font-size: 1.2em;
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.h3.fontWeight};
    font-size: ${(props) => props.theme.typography.h3.fontSize};
    margin-bottom: 20px;
`;

const LogOutButton = styled(Button)`
    width: 300px;
    background-color: ${(props) => props.theme.colors.backgroundCounter} !important;
    color: ${(props) => props.theme.colors.textCounter} !important;
`;

export function SettingPage({ setLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setLoggedIn(false);

        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <PageContainer>
            <StyledH1>Einstellungen</StyledH1>
            <StyledH3>Hier kannst du die Einstellungen deines Kontos verwalten.</StyledH3>
            <LogOutButton onClick={handleLogout}>Ausloggen</LogOutButton>
        </PageContainer>
    );
}
