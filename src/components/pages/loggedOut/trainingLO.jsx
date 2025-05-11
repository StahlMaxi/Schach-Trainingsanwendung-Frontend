import React, { useState, useLayoutEffect } from "react";
import styled from "styled-components";
import { useTheme } from "../../../theme/themeContext";
import { DeviceSize } from "../../responsive";
import { Chessboard } from "react-chessboard";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const PageContainer = styled.div`
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: row;
`;

const ChessboardContainer = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(
        to bottom,
        ${(props) => props.theme.colors.backgroundCounter} 70%,
        ${(props) => props.theme.colors.background} 30%
    );
    padding-left: 100px;
    padding-top: 40px;

    @media (max-width: ${DeviceSize.loPage}px) {
        display: none;
    }
`;


const InformationContainer = styled.div`
    width: 50%;
    height: 70%;
    background-color: ${(props) => props.theme.colors.backgroundCounter};
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: ${DeviceSize.loPage}px) {
        width: 100%;
        height: 100%;
        background-color: ${(props) => props.theme.colors.background};
    }
`;

const InformationContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    gap: 20px;
    padding: 20px;
`;

const StyledHeadline = styled.div`
    color: ${(props) => props.theme.colors.textCounter};
    font-weight: ${(props) => props.theme.typography.h1.fontWeight};
    font-size: ${(props) => props.theme.typography.h1.fontSize};

    @media (max-width: ${DeviceSize.loPage}px) {
        color: ${(props) => props.theme.colors.text};
    }
`;

const StyledText = styled.div`
    color: ${(props) => props.theme.colors.textCounter};
    font-weight: ${(props) => props.theme.typography.h3.fontWeight};
    font-size: ${(props) => props.theme.typography.h3.fontSize};

    @media (max-width: ${DeviceSize.loPage}px) {
        color: ${(props) => props.theme.colors.text};
    }
`;

const NavigateButton = styled(Button)`
    width: 200px;
    height: 50px;
`;

export function TrainingPageLO() {
    const theme = useTheme();
    const [boardWidth, setBoardWidth] = useState(0);

    const buttonColor = {
        backgroundColor: theme.theme.colors.background,
        color: theme.theme.colors.text,

        ["@media (max-width:1500px)"]: {
            backgroundColor: theme.theme.colors.backgroundCounter,
            color: theme.theme.colors.textCounter,
        }
    };

    useLayoutEffect(() => {
        const handleBoardWidth = () => {
            const divElement = document.getElementById('boardDiv');
            if (divElement) {
                setBoardWidth(divElement.offsetWidth * 0.8);
            }
        };

        handleBoardWidth();
        window.addEventListener("resize", handleBoardWidth);
        return () => window.removeEventListener("resize", handleBoardWidth);
    }, []);

    return (
        <PageContainer>
            <ChessboardContainer id="boardDiv">
                {boardWidth > 0 && (
                    <Chessboard id="BasicBoard" boardWidth={boardWidth} />
                )}
            </ChessboardContainer>
            <InformationContainer>
                <InformationContent>
                    <StyledHeadline>Trainiere wie ein Schachmeister!</StyledHeadline>
                    <StyledText>Vertiefe dein Können mit gezielten Übungen und verbessere jeden Zug.</StyledText>

                    <StyledText>Hier kannst du dich anmelden:</StyledText>
                    <Link to="/login">
                        <NavigateButton sx={buttonColor} variant="contained">Login</NavigateButton>
                    </Link>

                    <StyledText>Hier kannst du dich registrieren:</StyledText>
                    <Link to="/register">
                        <NavigateButton sx={buttonColor} variant="contained">Registrieren</NavigateButton>
                    </Link>
                </InformationContent>
            </InformationContainer>
        </PageContainer>
    );
}