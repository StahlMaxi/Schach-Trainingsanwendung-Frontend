import React, { useLayoutEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button, TextField, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "../../../theme/themeContext";
import { Link } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CachedIcon from '@mui/icons-material/Cached';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DeviceSize } from "../../responsive";

import { getOpenings } from "../../../services/openingService";
import { getNextOpeningMoves } from "../../../services/openingService";

const PageContainer = styled.div`
    display: flex;
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.background};
    padding: 50px;

    @media (min-width: ${DeviceSize.laptop}px) {
        height: calc(100vh - 60px); 
    }

    @media (max-width: ${DeviceSize.laptop}px) {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

//Schachbrett
//Padding Left for horizontal positioning
const ChessBoardContainer = styled.div`
    width: 60%;
    margin-right: 50px;
    padding-left: 150px;

    @media (max-width: 1700px) {
        padding-left: 100px;
    }

    @media (max-width: 1500px) {
        padding-left: 50px;
    }

    @media (max-width: ${DeviceSize.laptop}px) {
        order: 1;
        width: 60%;
        padding-left: 0px;
    }

    @media (max-width: ${DeviceSize.tablet}px) {
        order: 1;
        width: 100%;
        height: 50%;
        margin-right: 0px;
        margin-bottom: 20px;
        padding-left: 200px;
    }

    @media (max-width: 800px) {
        padding-left: 100px;;
    }

    @media (max-width: 700px) {
        padding-left: 0px;;
    }
`;

//Varianten auswählen
const ControlContainer = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    background-color: ${(props) => props.theme.colors.card};
    margin-right: 20px;

    @media (max-width: ${DeviceSize.laptop}px) {
        order: 2;
        flex: 1;
        height: ${({ $boardHeight }) => `${$boardHeight}px`};
        margin-right: 0;
    }

    @media (max-width: ${DeviceSize.tablet}px) {
        height: auto;
    }
`;

const StyledH3 = styled.h3`
    text-align: center;

    @media (max-width: ${DeviceSize.tablet}px) {
        order: 3;
    }
`;

const OpeningEndContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-top: 20px;
    background-color: ${(props) => props.theme.colors.hover};

    @media (max-width: ${DeviceSize.tablet}px) {
        order: 2;
    }
`;

const StyledText = styled.div`
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.body.fontWeight};
    font-size: ${(props) => props.theme.typography.body.fontSize};
`;

const BackButton = styled(Button)`
    width: 100px;
    height: 50px;
`;

const MoveScrollContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;

    @media (max-width: ${DeviceSize.tablet}px) {
        max-height: 300px;
        order: 5;
        margin-top: 10px;
    }
`;

const ScrollableMoveList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MoveItem = styled.div`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    background-color: ${(props) => props.selected ? props.theme.colors.selected : 'transparent'};
    transition: background-color 0.2s;

    &:hover {
        background-color: ${(props) =>
            props.selected
                ? props.theme.colors.selectedHover
                : props.theme.colors.hover};
    }
`;

const VariantContainer = styled.div`
    display: flex;
    flex-direction: column;

    @media (max-width: ${DeviceSize.tablet}px) {
        order: 3;
    }
`;

const Separator = styled.hr`
    margin: 20px 0;
    border: 0;
    border-top: 1px solid #000;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;

    @media (max-width: ${DeviceSize.tablet}px) {
        order: 1;
    }
`;

//Eröffnungen
const OpeningContainer = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-self: flex-end;
    margin-left: auto;

    @media (max-width: ${DeviceSize.laptop}px) {
        order: 3;
        width: 100vh;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 20px;
    }

    @media (max-width: ${DeviceSize.tablet}px) {
        width: 100%;
        flex-direction: column;
    }
`;

const StyledOpeningsContainer = styled.div`
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: ${(props) => props.theme.colors.card};

     @media (max-width: ${DeviceSize.laptop}px) {
        max-height: 300px;
    }
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
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    
    &:hover {
        background-color: ${(props) => props.theme.colors.hover};
    }
`;

const InformationContainer = styled.div`
    background-color: ${(props) => props.theme.colors.card};
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: ${DeviceSize.laptop}px) {
        flex: 1;
    }
`;

const StyledPlayedMovesContainer = styled.div`
    display: flex;
    justifyContent: space-between;
    text-align: center;
`;

const PlayedMoves = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: monospace;
    font-size: 16px;
    margin-left: 15px;
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.body.fontWeight};
    font-size: ${(props) => props.theme.typography.body.fontSize};
`;

const MovesPlayedText = styled.div`
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.h3.fontWeight};
    font-size: ${(props) => props.theme.typography.h3.fontSize};
    text-align: center;
`;

export function LearningPage({ handleLogOut }) {
    const theme = useTheme();

    const [boardWidth, setBoardWith] = useState(0);
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState("start");
    const [isBoardFlipped, setIsBoardFlipped] = useState(false);

    const [openings, setOpenings] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedOpening, setSelectedOpening] = useState(-1);

    const [nextMoves, setNextMoves] = useState([]);
    const [selectedMoveIndex, setSelectedMoveIndex] = useState(-1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [playedMoves, setPlayedMoves] = useState("");

    const [variantEnd, setVariantEnd] = useState(false);
    const [endedVariant, setEndedVariant] = useState(null);

    const [moveHistory, setMoveHistory] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    const buttonColor = {
        backgroundColor: theme.theme.colors.backgroundCounter,
        color: theme.theme.colors.textCounter,
    };

    const getOpeningsRequest = useCallback(async () => {
        try {
            const data = await getOpenings();
            setOpenings(data);
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
    }, [handleLogOut]);

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
        const lowerSearch = search.toLowerCase();
        const nameMatches = opening.name?.toLowerCase().startsWith(lowerSearch);
        const idMatches = opening.id?.toString().startsWith(search);
        return nameMatches || idMatches;
    });

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const openingSelected = (opening) => {
        setSearch(opening.name);
        setSelectedOpening(opening.id);
        getNextOpeningMovesRequest(opening.id);
    }

    const resetSelectedOpening = () => {
        const freshGame = new Chess();

        setGame(freshGame);
        setFen(freshGame.fen());

        setSearch('');
        setSelectedOpening(-1);
        setNextMoves([]);
        setPlayedMoves("");
        setMoveHistory([]);
        setVariantEnd(false);
        setSelectedVariant(null);
        setSelectedMoveIndex(-1);
    };

    async function getNextOpeningMovesRequest(id, played = "") {
        try {
            const data = await getNextOpeningMoves({ id, played });
            const filteredMoves = data.filter(move => move.move && move.move.trim() !== "");

            setVariantEnd(false);

            if(selectedVariant) {
                const index = filteredMoves.findIndex(move => move.name === selectedVariant.name);
                
                if (index !== -1) {
                    setSelectedVariant(filteredMoves[index]);
                    setSelectedMoveIndex(index);
                } else {
                    setVariantEnd(true);
                    setEndedVariant(selectedVariant);
                    setSelectedVariant(null);
                    setSelectedMoveIndex(-1);
                }
            } else if(endedVariant) {
                const indexEndedVariant = filteredMoves.findIndex(move => move.name === endedVariant.name);
                
                if(indexEndedVariant !== -1) {
                    setSelectedMoveIndex(indexEndedVariant);
                    setSelectedVariant(endedVariant);
                    setEndedVariant(null);
                }
            }

            setNextMoves(filteredMoves);
        } catch (error) {
            let message = "Ein unerwarteter Fehler ist aufgetreten.";
            if(error.status === 400) {
                message = "Das Played-Parameter ist nicht korrekt formatiert";
            } else if(error.status === 401) {
                message = "Sie sind nicht autorisiert für diesen Endpunkt.";
                handleLogOut();
            } else {
                message = "Fehler beim Abruf der Eröffnungen.";
            }

            showSnackbar(message, "error");
        }
    }

    const handleSelectedMove = (index) => {
        setSelectedMoveIndex(index);
        setSelectedVariant(nextMoves[index]);
    }

    const handleForward = () => {
        if (selectedMoveIndex !== -1 && nextMoves[selectedMoveIndex]) {

            const move = nextMoves[selectedMoveIndex].move;

            const newGame = new Chess();
            moveHistory.forEach(m => newGame.move(m, { sloppy: true }));

            const result = newGame.move(move, { sloppy: true });

            if (result) {
                const newPlayedMoves = playedMoves ? `${playedMoves} ${move}` : move;

                setGame(newGame);
                setFen(newGame.fen());
                setPlayedMoves(newPlayedMoves);
                setMoveHistory(prev => [...prev, move]);

                getNextOpeningMovesRequest(selectedOpening, newPlayedMoves);
            } else {
                showSnackbar("Ungültiger Zug: " + move, "error");
            }
        }
    };

    const handleBack = () => {
        if (moveHistory.length > 0) {
            const newHistory = [...moveHistory];
            newHistory.pop();

            const newPlayedMoves = newHistory.join(" ");
            setPlayedMoves(newPlayedMoves);
            setMoveHistory(newHistory);

            const newGame = new Chess();
            newHistory.forEach(move => newGame.move(move, { sloppy: true }));

            setGame(newGame);
            setFen(newGame.fen());

            getNextOpeningMovesRequest(selectedOpening, newPlayedMoves);
        }
    };

    const handleFlipBoard = () => {
        setIsBoardFlipped(prevState => !prevState);
    };

    return (
        <PageContainer>
            <ChessBoardContainer id="boardDiv">
                {boardWidth > 0 && <Chessboard
                    id="BasicBoard"
                    position={fen}
                    boardWidth={boardWidth}
                    arePiecesDraggable={false}
                    boardOrientation={isBoardFlipped ? 'black' : 'white'}
                />}
            </ChessBoardContainer>
            <ControlContainer $boardHeight={boardWidth}>
                {variantEnd && (
                    <OpeningEndContainer>
                        <StyledText>
                            Die Eröffnungsvariante <strong>{endedVariant.name}</strong> ist zu Ende. Möchtest du sie nun üben?
                        </StyledText>
                        <Link to={`/train/${selectedOpening}/${endedVariant.name}`}>
                            <BackButton sx={buttonColor} variant="contained">Üben</BackButton>
                        </Link>
                    </OpeningEndContainer>
                )}

                {selectedOpening === -1 && <StyledH3>Eröffnung auswählen</StyledH3>}
                {selectedOpening !== -1 && !variantEnd && <StyledH3>Nächsten Zug auswählen</StyledH3>}
                {selectedOpening !== -1 && variantEnd && nextMoves.length !== 0 && <StyledH3>Oder Nächsten Zug auswählen</StyledH3>}

                <MoveScrollContainer>
                    <ScrollableMoveList>
                        {nextMoves
                            .filter((moveData) => moveData.move)
                            .map((moveData, index) => (
                                <MoveItem
                                    key={index}
                                    selected={index === selectedMoveIndex}
                                    onClick={() => handleSelectedMove(index)}
                                >
                                    <strong>{moveData.move}</strong> - {moveData.name}
                                </MoveItem>
                            ))}
                    </ScrollableMoveList>
                </MoveScrollContainer>

                { selectedVariant && <VariantContainer>
                    <Separator/>
                    <StyledText>
                        <strong>Variante:</strong> {selectedVariant.name}
                    </StyledText>
                    <StyledText>
                        <strong>Zug:</strong> {selectedVariant.move}
                    </StyledText>
                </VariantContainer>}

                <ButtonContainer>
                    <IconButton onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    <IconButton onClick={handleFlipBoard}>
                        <CachedIcon />
                    </IconButton>
                    <IconButton onClick={() => handleForward()}>
                        <ArrowForwardIcon />
                    </IconButton>
                </ButtonContainer>
            </ControlContainer>
            <OpeningContainer>
                <StyledOpeningsContainer style={{ height: selectedOpening === -1 ? '100%' : '100px' }}>
                    <StyledTextFieldWrapper>
                        <StyledTextField
                            id="outlined-basic"
                            value={search}
                            onChange={handleSearchChange}
                            label="Eröffnung auswählen (Name/ID)"
                            variant="outlined"
                        />
                        <StyledIconButton onClick={() => resetSelectedOpening()}>
                            <DeleteIcon />
                        </StyledIconButton>
                    </StyledTextFieldWrapper>
                    {selectedOpening === -1 && (
                        <OpeningScrollContainer>
                            {filteredOpenings.length === 0 ? (
                                <div>Keine Eröffnungen gefunden</div>
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
                {moveHistory.length !== 0 && (
                    <InformationContainer>
                        <MovesPlayedText>Gespielte Züge</MovesPlayedText>
                        <StyledPlayedMovesContainer>
                            <div style={{ flex: 1 }}>
                                <strong>Weiß:</strong>
                                <PlayedMoves>
                                    {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, i) => (
                                        <React.Fragment key={i}>
                                            <div>{moveHistory[i * 2] || ""}</div>
                                        </React.Fragment>
                                    ))}
                                </PlayedMoves>
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>Schwarz:</strong>
                                <PlayedMoves>
                                    {Array.from({ length: Math.floor(moveHistory.length / 2) }, (_, i) => (
                                        <React.Fragment key={i}>
                                            <div>{moveHistory[i * 2 + 1] || ""}</div>
                                        </React.Fragment>
                                    ))}
                                </PlayedMoves>
                            </div>
                        </StyledPlayedMovesContainer>
                    </InformationContainer>
                )}
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