import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { DeviceSize } from "../../responsive";
import ChessBoard from "../../../assets/chessBoard.webp";
import { useTheme } from "../../../theme/themeContext";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
`;

const WelcomeContainer = styled.div`
    height: 75%;
    background-color: ${(props) => props.theme.colors.backgroundCounter};
    padding: 20px;

    @media (max-width: ${DeviceSize.tablet}px) {
        padding: 0;
    }
`;

const WelcomeWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    @media (max-width: ${DeviceSize.tablet}px) {
        position: relative;
    }
`;

const ChessImg = styled.img`
    height: 100%;
    width: auto;
    object-fit: contain;

    @media (max-width: ${DeviceSize.tablet}px) {
        width: 100%;
    }
`;

const WelcomeText = styled.h2`
    color: ${(props) => props.theme.colors.textCounter};
    font-weight: ${(props) => props.theme.typography.h2.fontWeight};
    font-size: ${(props) => props.theme.typography.h2.fontSize};
    text-align: center;
    margin: 20px;

    @media (max-width: ${DeviceSize.mobile}px) {
        color: ${(props) => props.theme.colors.text};
        margin-bottom: 50px;
    }
`;

const FooterContainer = styled.div`
    background-color: ${(props) => props.theme.colors.navbar};
    padding: 20px 100px 20px 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: ${DeviceSize.mobile}px) {
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: ${DeviceSize.tablet}px) {
        height: 25%;
    }
`;

const AccessibilityButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    margin: 20px;

    @media (max-width: ${DeviceSize.tablet}px) {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`;

const AccessibilityButton = styled(Button)`
    width: 200px;
    height: 50px;
`;

const AdvantagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
    flex-grow: 1;
    margin: 20px;

    @media (max-width: ${DeviceSize.mobile}px) {
        margin: 0 0 4px 0;
        width: 250px;
    }
`;

const AdvantageContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const AdvantageText = styled.p`
    margin: 0 0 0 10px;
`;

export function HomePageLO() {
    const theme = useTheme();
    const isMobile = useMediaQuery({ maxWidth: DeviceSize.mobile });
    const isTablet = useMediaQuery({ maxWidth: DeviceSize.tablet });

    const buttonColor = {
        backgroundColor: theme.theme.colors.backgroundCounter,
        color: theme.theme.colors.textCounter,
    };

    const iconColor = {
        color: theme.theme.colors.active,
    };

    return(
        <PageContainer>
            <WelcomeContainer>
                <WelcomeWrapper>
                    <ChessImg src={ChessBoard} alt="Chessboard"/>
                    {!isTablet && <WelcomeText>
                        Meistere den ersten Zug - Entdecke, lerne und perfektioniere die besten Schacheröffnungen!
                    </WelcomeText>}      
                </WelcomeWrapper>         
            </WelcomeContainer>
            <FooterContainer>
                {isMobile && <WelcomeText>
                    Meistere den ersten Zug - Entdecke, lerne und perfektioniere die besten Schacheröffnungen!
                </WelcomeText>} 
                <AdvantagesContainer>
                    <AdvantageContainer>
                        <CheckCircleOutlineIcon sx={iconColor}/>
                        <AdvantageText>Interaktive Schachlektionen</AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <CheckCircleOutlineIcon sx={iconColor}/>
                        <AdvantageText>Große Auswahl an Eröffnungen</AdvantageText>
                    </AdvantageContainer>
                </AdvantagesContainer>
                <AccessibilityButtonsContainer>
                    <Link to="/login">
                        <AccessibilityButton sx={buttonColor} variant="contained">Login</AccessibilityButton>
                    </Link>
                    <Link to="/register">
                        <AccessibilityButton  sx={buttonColor} variant="contained">Registrieren</AccessibilityButton>
                    </Link>
                </AccessibilityButtonsContainer>
                <AdvantagesContainer>
                <AdvantageContainer>
                    <CheckCircleOutlineIcon sx={iconColor}/>
                        <AdvantageText>Übung gelernter Eröffnungen mit Tipps</AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <CheckCircleOutlineIcon sx={iconColor}/>
                        <AdvantageText>Vorschläge zu lernender Eröffnungen</AdvantageText>
                    </AdvantageContainer>
                </AdvantagesContainer>
            </FooterContainer>
        </PageContainer>
    );
}