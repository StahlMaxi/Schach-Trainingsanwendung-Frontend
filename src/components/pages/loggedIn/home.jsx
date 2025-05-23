import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "../../../theme/themeContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ChessBoard from "../../../assets/chessboardWithoutFigures.avif";

import { getOpenings } from "../../../services/openingService";
import { getOpeningStatistics } from "../../../services/statisticsService";

const PageContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100vh - 60px);
    background: linear-gradient(
        to bottom,
        ${(props) => props.theme.colors.backgroundCounter} 75%,
        ${(props) => props.theme.colors.background} 25%
    );
`;

const NavigationContainer = styled.div`
    width: 50%;
    height: 100%;
`;

const ChessBoardContainer = styled.div`
    position: relative;
    height: 75%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px;
`;

const ChessImg = styled.img`
    height: 100%;
    width: auto;
    object-fit: contain;
    display: block;
`;

const ModeButtonContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
`;

const ModeButton = styled(Button)`
    width: 500px;
    height: 75px;
`;

const NavigationFooterContainer = styled.div`
    height: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const StyledH3 = styled.h3`
    text-align: center;
    width: 100%;
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.h3.fontWeight};
    font-size: ${(props) => props.theme.typography.h3.fontSize};
`;

const RightContainer = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const RankingContainer = styled.div`
    flex: 1;
    padding: 50px;
    overflow: hidden;
    margin-bottom: 50px;
    max-width: 1000px;
`;

const RankingScrollContainer = styled.div`
    height: 100%;
    overflow-y: auto;
    padding-bottom: 20px;
`;

const RankingEntry = styled.div`
  margin-bottom: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  background-color: ${(props) => props.theme.colors.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const RankingH2 = styled.h2`
    margin-bottom: 20px;
    color: ${(props) => props.theme.colors.textCounter};
    font-weight: ${(props) => props.theme.typography.h2.fontWeight};
    font-size: ${(props) => props.theme.typography.h2.fontSize};
`;

const Highlight = styled.span`
    font-weight: bold;
`;

const NavigationButtonsContainer = styled.div`
    height: 25%;
    display: flex;
    flex-direction: row;
    gap: 25px;
    justify-content: center;
    align-items: center;
`;

const NavigationButton = styled(Button)`
    width: 300px;
    height: 50px;
`;

export function HomePage({ handleLogOut }) {
    const theme = useTheme();

    const [statistics, setStatistics] = useState([]);
    const sortedStatistics = [...statistics].sort((a, b) => a.expertise - b.expertise);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    const navigate = useNavigate();

    const buttonColorMode = {
        backgroundColor: theme.theme.colors.background,
        color: theme.theme.colors.text,
        fontSize: '24px'
    };

    const buttonColorNav = {
        backgroundColor: theme.theme.colors.backgroundCounter,
        color: theme.theme.colors.textCounter,
    };

    const getStatistics = useCallback(async () => {
        try {
            const data = await getOpeningStatistics();
            setStatistics(data);
        } catch (error) {
            let message;
            if (error.status === 401) {
                message = "Sie sind nicht autorisiert für diesen Endpunkt.";
                handleLogOut();
            } else {
                message = "Fehler beim Abruf der Statistiken.";
            }
            showSnackbar(message, "error");
        }
    }, [handleLogOut]);

    useEffect(() => {
        getStatistics();
    }, [getStatistics]); 

    const showSnackbar = (message, severity = "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const navigateToTrain = async (variantStats) => {
        try {
            const variantBaseName = variantStats.openingName.split(":")[0].trim();  

            if(variantBaseName === variantStats.openingName) {
                navigate(`/train/${variantStats.openingId}/${variantStats.openingId}`);
            } else {
                const data = await getOpenings();
                const opening = data.find((opening) => opening.name === variantBaseName);
                navigate(`/train/${opening.id}/${variantStats.openingId}`);
            }
        } catch (error) {
            let message;
            if (error.status === 401) {
                message = "Sie sind nicht autorisiert für diesen Endpunkt.";
                handleLogOut();
            } else {
                message = "Fehler beim Abruf der Eröffnungen.";
            }
            showSnackbar(message, "error");
        }
    };

    return(
        <PageContainer>
            <NavigationContainer>
                <ChessBoardContainer>
                    <ChessImg src={ChessBoard} alt="Chessboard"/>
                    <ModeButtonContainer>
                        <Link to="/learn">
                            <ModeButton sx={buttonColorMode} variant="contained">Lerne eine neue Eröffnung</ModeButton>
                        </Link>
                        <Link to="/train">
                            <ModeButton  sx={buttonColorMode} variant="contained">Trainieere eine Eröffnung</ModeButton>
                        </Link>
                    </ModeButtonContainer>
                </ChessBoardContainer>
                <NavigationFooterContainer>
                    <StyledH3>
                        Jede Eröffnung ist ein erster Zug in Richtung Sieg – lerne die besten Strategien und beherrsche das Spiel von Anfang an!
                    </StyledH3>
                </NavigationFooterContainer>
            </NavigationContainer>
            <RightContainer>
                <RankingContainer>
                    <RankingH2>Diese Eröffnungsvarianten solltest du üben</RankingH2> 
                    <RankingScrollContainer>
                        {sortedStatistics.map((stat, index) => (
                            <RankingEntry
                                key={stat.openingId}
                                onClick={() => navigateToTrain(stat)}
                                style={{ cursor: "pointer" }}
                                >
                                <div style={{ marginBottom: "8px", fontWeight: "bold", fontSize: "1.1rem" }}>
                                    {index + 1}. {stat.openingName}
                                </div>
                                <div style={{ fontSize: "0.95rem" }}>
                                    Ø Fehler: <Highlight>{stat.avgErrors.toFixed(2)}</Highlight> <br />
                                    Ø Tipps: <Highlight>{stat.avgHints.toFixed(2)}</Highlight>
                                </div>
                            </RankingEntry>
                        ))}
                    </RankingScrollContainer>
                </RankingContainer>
                <NavigationButtonsContainer>
                    <Link to="/statistics">
                        <NavigationButton sx={buttonColorNav} variant="contained">Deine Statistiken</NavigationButton>
                    </Link>
                    <Link to="/opening">
                        <NavigationButton  sx={buttonColorNav} variant="contained">Die Schacheröffnung</NavigationButton>
                    </Link>
                </NavigationButtonsContainer>
            </RightContainer>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
}