import React, { useLayoutEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useTheme } from "../../../theme/themeContext";
import { TextField, IconButton, Button } from "@mui/material";
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { DeviceSize } from "../../responsive";

import { getOpenings, getVariants, getNextVariantMove } from "../../../services/openingService";
import { setVariantStatistics } from "../../../services/statisticsService";

const PageContainer = styled.div`
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.background};
    padding: 50px;
`;

const ChessBoardContainer = styled.div`
    width: 60%;
    margin-right: 50px;
    padding-left: 150px;
`;

//Select Opening and Variant
const OpeningContainer = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-self: flex-end;
    margin-left: auto;
`;

const StyledOpeningsContainer = styled.div`
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: ${(props) => props.theme.colors.card};
`;

const StyledTextFieldWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const StyledTextField = styled(TextField)`
    flex-grow: 1;
`;

const StyledIconButton = styled(IconButton)`
    margin-left: 10px;
    padding: 8px;
`;

const OpeningScrollContainer = styled.div`
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
`;

const OpeningItem = styled.div`
    padding: 10px;
    cursor: pointer;

    &:not(:last-child) {
        border-bottom: 1px solid #ccc;
    }

    &:hover {
        background-color: ${(props) => props.theme.colors.hover};
    }
`;

const StyledButton = styled(Button)`
    width: 100%;
    height: 50px;
`;

//Information
const InformationContainer = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    background-color: ${(props) => props.theme.colors.card};
    margin-right: 20px;
`;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledH3 = styled.h3`
    text-align: center;
    margin-right: 20px;
`;

const ResetButton = styled(IconButton)`
    float: right;
`;

const HintButton = styled(Button)`
    margin-top: 10px;
`;

const InfoSection = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Info = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Label = styled.p`
    font-weight: bold;
    margin-right: 10px;
`;

const Separator = styled.div`
    height: 1px;
    background-color: #ccc;
    margin: 15px 0;
`;


export function TrainingPage({ handleLogOut }) {
    const theme = useTheme();

    const { openingID, variantName } = useParams();

    const [boardWidth, setBoardWith] = useState(0);
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState("start");

    const [openings, setOpenings] = useState([]);
    const [variants, setVariants] = useState([]);
    const [openingSearch, setOpeningSearch] = useState("");
    const [selectedOpeningId, setSelectedOpeningId] = useState(-1);
    const [variantSearch, setVariantSearch] = useState("");
    const [selectedVariantId, setSelectedVariantId] = useState(-1);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const [startWhite, setStartWhite] = useState(true);
    const [playedMoves, setPlayedMoves] = useState("");

    const [gameText, setGameText] = useState("");
    const [playerError, setPlayerError] = useState(false);
    const [errors, setErrors] = useState(0);
    const [hints, setHints] = useState(0);
    const [hintStep, setHintStep] = useState(0);
    const [hintText, setHintText] = useState("");

    const [nextExpectedPlayerMove, setNextExpectedPlayerMove] = useState("");

    const [gameRunning, setGameRunning] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    const navigate = useNavigate();

    const buttonColor = {
        backgroundColor: theme.theme.colors.backgroundCounter,
        color: theme.theme.colors.textCounter,
    };

    const getVariantsRequest = useCallback(async (openingId) => {
        try {
            const data = await getVariants(openingId);
            setVariants(data);

            if (variantName) {
                const variant = data.find(variant => variant.name === variantName);
                if (variant) {
                    setVariantSearch(variantName);
                    setSelectedVariantId(variant.id);
                    setSelectedVariant(variant);
                }
            }
        } catch (error) {
            let message;
            if (error.status === 401) {
                message = "Sie sind nicht autorisiert für diesen Endpunkt.";
                handleLogOut();
            } else {
                message = "Fehler beim Abruf der Varianten.";
            }
            showSnackbar(message, "error");
        }
    }, [handleLogOut, variantName]);

    const getOpeningsRequest = useCallback(async () => {
        try {
            const data = await getOpenings();
            setOpenings(data);

            if (openingID) {
                const opening = data.find(opening => opening.id === openingID);
                if (opening) {
                    setOpeningSearch(opening.name);
                    setSelectedOpeningId(openingID);
                    getVariantsRequest(openingID);
                }
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
    }, [handleLogOut, openingID, getVariantsRequest]);

    useLayoutEffect(() => {
        const updateBoardSize = () => {
            const divElement = document.getElementById("boardDiv");
            if (divElement) {
                const isTabletOrSmaller = window.innerWidth <= DeviceSize.tablet;
                const divWidth = divElement.offsetWidth;

                if(isTabletOrSmaller) {
                    const size = isTabletOrSmaller
                        ? Math.min(divWidth, window.innerHeight * 0.5)
                        : divWidth;

                    setBoardWith(size);
                } else {
                    const availableHeight = window.innerHeight - 150; 
                    const maxSize = Math.min(divWidth, availableHeight);

                    setBoardWith(maxSize);
                }
            }
        };

        updateBoardSize();

        getOpeningsRequest();

        window.addEventListener("resize", updateBoardSize);

        return () => {
            window.removeEventListener("resize", updateBoardSize);
        };
    }, [getOpeningsRequest]);

    const showSnackbar = (message, severity = "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const filteredOpenings = openings.filter(opening => {
        const lowerSearch = openingSearch.toLowerCase();
        const nameMatches = opening.name?.toLowerCase().startsWith(lowerSearch);
        const idMatches = opening.id?.toString().startsWith(openingSearch);
        return nameMatches || idMatches;
    });

    const handleOpeningSearchChange = (e) => {
        setOpeningSearch(e.target.value);
    };

    const openingSelected = (opening) => {
        setOpeningSearch(opening.name);
        setSelectedOpeningId(opening.id);
        getVariantsRequest(opening.id);
    }

    const resetSelectedOpening = () => {
        const freshGame = new Chess();
        setGame(freshGame);
        setFen(freshGame.fen());

        setOpeningSearch("");
        setVariantSearch("");
        setSelectedOpeningId(-1);
        setSelectedVariantId(-1);
        navigate("/train");

        resetGame();
    };

    const filteredVariants = () => {
        const lowerSearch = variantSearch.toLowerCase();
        return variants.filter(variant =>
            variant.name?.toLowerCase().includes(lowerSearch)
        );
    };

    const variantSelected = (variant) => {
        setVariantSearch(variant.name);
        setSelectedVariantId(variant.id);
        setSelectedVariant(variant);
    };

    const resetSelectedVariant = () => {
        setVariantSearch("");
        setSelectedVariantId(-1);
        setSelectedVariant(null);
        navigate("/train");
        
        resetGame();
    }

    const startGame = async () => {
        if (selectedOpeningId !== -1 && selectedVariantId !== -1) {
            resetGame();
            setGameRunning(true);

            if(startWhite) {
                const variantData = await getNextVariantMoveRequest(selectedVariantId, "");
                const nextMove = variantData?.move;

                if (!nextMove) {
                    setGameText("Die Variante besitzt keine Züge");
                    setGameRunning(false);
                    return;
                } else {
                    setNextExpectedPlayerMove(nextMove);
                }
            }

            setGameText(startWhite ? "Du bist am Zug. Führe einen gültigen Zug aus." : "Der Computer beginnt.");

            if (!startWhite) {
                setTimeout(async () => {
                    await handleComputerTurn();
                }, 1000);
            }
        }
    };

    async function getNextVariantMoveRequest(id, played = "") {
        try {
            const data = await getNextVariantMove({ id, played });
            return data;
        } catch (error) {
            let message;
            if(error.status === 400) {
                message = "Das Played-Parameter ist nicht korrekt formatiert";
            } else if(error.status === 401) {
                message = "Sie sind nicht autorisiert für diesen Endpunkt.";
                handleLogOut();
            } else if(error.status === 404) {
                message = "Die angegebene Eröffnung existiert nicht.";
            } else {
                message = "Fehler beim Abruf des nächsten Zuges.";
            }
            showSnackbar(message, "error");
        }
    }

    const handlePlayerTurn = async (from, to) => {
        setPlayerError(false);

        const localGame = new Chess(fen);

        let attemptedMove;
        try {
            attemptedMove = localGame.move({ from, to, promotion: "q" })?.san;
        } catch (err) {
            setPlayerError(true);
            setGameText("Ungültiger Zug. Bitte führe einen legalen Zug aus.");
            return false;
        }
        const expectedMove = new Chess(fen).move(nextExpectedPlayerMove, { sloppy: true })?.san;

        if (attemptedMove === expectedMove) {
            const updatedGame = new Chess(fen);
            updatedGame.move(nextExpectedPlayerMove, { sloppy: true });

            const updatedMoves = playedMoves + (playedMoves ? "," : "") + nextExpectedPlayerMove;

            setGame(updatedGame);
            setFen(updatedGame.fen());
            setPlayedMoves(updatedMoves);

            setGameText("Richtiger Zug! Jetzt ist der Computer dran.");

            setHintStep(0);
            setHintText("");

            setTimeout(async () => {
                await handleComputerTurn(updatedGame, updatedMoves);
            }, 1000);
            return true;
        } else {
            setErrors(errors + 1);
            setPlayerError(true);
            setGameText("Falscher Zug. Versuche es nochmal.");
            return false;
        }
    };

    const handleComputerTurn = async (playerGame = game, currentMoves = playedMoves) => {
        const variantData = await getNextVariantMoveRequest(selectedVariantId, currentMoves);
        const nextMove = variantData?.move;

        if (!nextMove) {
            setGameText("Die Variante ist zu Ende. Deine Ergebnisse werden nun abgespeichert. Du kannst nun entweder eine neue Eröffnung trainieren oder von vorne starten.");
            setVariantStatisticsRequest();
            setTimeout(async () => {
                resetGame()
            }, 10000);
            return;
        }

        const gameCopy = new Chess(playerGame.fen());
        const moveResult = gameCopy.move(nextMove, { sloppy: true });

        if (!moveResult) {
            return;
        }

        const updatedMoves = currentMoves + (currentMoves ? "," : "") + nextMove;

        setGame(gameCopy);
        setFen(gameCopy.fen());
        setPlayedMoves(updatedMoves);

        const newVariantData = await getNextVariantMoveRequest(selectedVariantId, updatedMoves);
        const newNextMove = newVariantData?.move;

        if(!newNextMove) {
            setGameText("Die Variante ist zu Ende. Deine Ergebnisse werden nun abgespeichert. Du kannst nun entweder eine neue Eröffnung trainieren oder von vorne starten.");
            setVariantStatisticsRequest();
            setTimeout(async () => {
                resetGame()
            }, 10000);
            return;
        } else {
            setNextExpectedPlayerMove(newNextMove);
            setGameText("Du bist wieder am Zug. Führe einen gültigen Zug aus.");
        }
    };

    const resetGame = () => {
        setGameRunning(false);
        const freshGame = new Chess();

        setGame(freshGame);
        setFen(freshGame.fen());
        setPlayedMoves("");

        setNextExpectedPlayerMove(null);

        setGameText("");
        setErrors(0);

        setHints(0);
        setHintStep(0);
        setHintText("");
    };

    const handleHint = () => {
        if (!nextExpectedPlayerMove || !gameRunning) return;

        const from = nextExpectedPlayerMove.slice(0, 2);
        const to = nextExpectedPlayerMove.slice(2, 4);

        if (hintStep === 0) {
            setHintText(`Zug beginnt auf Feld ${from}`);
        } else {
            setHintText(`Vollständiger Zug ist ${from} → ${to}`);

        }

        setHintStep(hintStep + 1);
        if(hintStep <= 1) {
            setHints(hints + 1);
        }
    };

    async function setVariantStatisticsRequest() {
        try {
            await setVariantStatistics({variantId: selectedVariantId, errors, hints});
        } catch (error) {
            let message;
            if(error.status === 401) {
                message = "Sie sind nicht autorisiert für diesen Endpunkt.";
                handleLogOut();
            } else if(error.status === 404) {
                message = "Es gibt keine Statistiken für diese Variante.";
            } else {
                message = "Fehler beim Erstellen der Statistik.";
            }
            showSnackbar(message, "error");
        }
    }

    return(
        <PageContainer>
            <ChessBoardContainer id="boardDiv">
                {boardWidth > 0 && <Chessboard
                    id="BasicBoard"
                    position={fen}
                    boardWidth={boardWidth}
                    boardOrientation={startWhite ? "white" : "black"}
                    onPieceDrop={(sourceSquare, targetSquare) => {
                        if (!gameRunning) return;
                        const turn = game.turn();
                        const isPlayerTurn = (startWhite && turn === 'w') || (!startWhite && turn === 'b');
                        if (!isPlayerTurn) return false;

                        const pieceOnSquare = game.get(sourceSquare);
                        if (!pieceOnSquare) return false;

                        const isUserPiece = (startWhite && pieceOnSquare.color === 'w') || (!startWhite && pieceOnSquare.color === 'b');
                        if (!isUserPiece) return false;

                        return handlePlayerTurn(sourceSquare, targetSquare);
                    }}
                />}
            </ChessBoardContainer>
            <InformationContainer>
                <InfoHeader>
                    {selectedVariantId === -1 && <StyledH3>Eröffnung und Variante auswählen</StyledH3>}
                    {selectedVariantId !== -1 && <StyledH3>{selectedVariant.name}</StyledH3>}
                    <ResetButton onClick={resetGame} color="error" title="Spiel zurücksetzen">
                        <RestartAltIcon />
                    </ResetButton>
                </InfoHeader>

                <Separator />

                <InfoSection>
                    {selectedVariantId !== -1 && !gameRunning && <strong><p>Wähle eine Startseite und starte das Spiel über den Startknopf</p></strong>}
                    {playerError && <strong><p style={{ color: "red" }}>{gameText}</p></strong>}
                    {!playerError && <strong><p>{gameText}</p></strong>}
                </InfoSection>

                <Separator />

                <InfoSection>
                    <Info>
                        <Label>Anzahl Fehler:</Label>
                        <p>{errors}</p>
                    </Info>
                    <Info>
                        <Label>Anzahl Hinweise:</Label>
                        <p>{hints}</p>
                    </Info>
                </InfoSection>

                <Separator />

                <InfoSection>
                    {hintText && 
                        <div>
                            <h3>Hinweis: </h3>
                            <p>{hintText}</p>
                        </div>
                    }
                    <HintButton
                        sx={buttonColor}
                        variant="contained"
                        onClick={handleHint}
                    >
                        Hinweis anzeigen
                    </HintButton>
                </InfoSection>
            </InformationContainer>
            <OpeningContainer>
                <StyledOpeningsContainer style={{ height: selectedOpeningId === -1 ? '100%' : null }}>
                    <StyledTextFieldWrapper>
                        <StyledTextField
                            value={openingSearch}
                            onChange={handleOpeningSearchChange}
                            label="Eröffnung auswählen (Name/ID)"
                            variant="outlined"
                        />
                        <StyledIconButton onClick={resetSelectedOpening}>
                            <DeleteIcon />
                        </StyledIconButton>
                    </StyledTextFieldWrapper>
                    {selectedOpeningId === -1 && (
                        <OpeningScrollContainer>
                            {filteredOpenings.length === 0 ? (
                                <div>Keine Eröffnung gefunden</div>
                            ) : (
                                filteredOpenings.map((opening, index) => (
                                    <OpeningItem key={index} onClick={() => openingSelected(opening)}>
                                        {opening.name}
                                    </OpeningItem>
                                ))
                            )}
                        </OpeningScrollContainer>
                    )}
                </StyledOpeningsContainer>
                {selectedOpeningId !== -1 && (
                    <StyledOpeningsContainer>
                        <StyledTextFieldWrapper>
                            <StyledTextField
                                value={variantSearch}
                                onChange={(e) => setVariantSearch(e.target.value)}
                                label="Variante auswählen"
                                variant="outlined"
                            />
                            <StyledIconButton onClick={resetSelectedVariant}>
                                <DeleteIcon />
                            </StyledIconButton>
                        </StyledTextFieldWrapper>
                        {selectedVariantId === -1 && (
                            <OpeningScrollContainer>
                                {filteredVariants().length === 0 ? (
                                    <div>Keine Varianten gefunden</div>
                                ) : (
                                    filteredVariants().map((variant, index) => (
                                        <OpeningItem key={index} onClick={() => variantSelected(variant)}>
                                            {variant.name}
                                        </OpeningItem>
                                    ))
                                )}
                            </OpeningScrollContainer>
                        )}
                    </StyledOpeningsContainer>
                )}
                {selectedVariantId !== -1 && <StyledOpeningsContainer>
                    <FormControl fullWidth variant="outlined" style={{ marginTop: '20px' }}>
                        <InputLabel id="color-select-label">Startseite wählen</InputLabel>
                        <Select
                            labelId="color-select-label"
                            id="color-select"
                            value={startWhite}
                            onChange={(e) => setStartWhite(e.target.value === "true")}
                            label="Farbe wählen"
                            disabled={gameRunning}
                        >
                            <MenuItem value="true">Weiß</MenuItem>
                            <MenuItem value="false">Schwarz</MenuItem>
                        </Select>
                    </FormControl>
                    <StyledButton sx={buttonColor} onClick={startGame} variant="contained">Start</StyledButton>
                </StyledOpeningsContainer>}
            </OpeningContainer>
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