import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button, TextField } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "../../../theme/themeContext";
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { getOpenings } from "../../../services/openingService";
import { getNextOpeningMoves } from "../../../services/openingService";

const PageContainer = styled.div`
    height: calc(100vh - 60px); 
    display: flex;
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.background};
    padding: 50px;
`;

//Schachbrett
const ChessBoardContainer = styled.div`
    width: 60%;
    padding-left: 150px;
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

//Eröffnungen
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

export function LearningPage() {
    const theme = useTheme();

    const [boardWidth, setBoardWith] = useState(0);
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState("start");

    const [openings, setOpenings] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedOpening, setSelectedOpening] = useState(-1);

    const [nextMoves, setNextMoves] = useState([]);
    const [playedMoves, setPlayedMoves] = useState("");
    const [noMoreMoves, setNoMoreMoves] = useState(false);

    const [moveHistory, setMoveHistory] = useState([]);

    const buttonColor = {
        backgroundColor: theme.theme.colors.backgroundCounter,
        color: theme.theme.colors.textCounter,
    };

    useLayoutEffect(() => {
        const tokenCorrect = checkValidToken();
        if (tokenCorrect) {
            getOpeningsRequest();
        }

        const divElement = document.getElementById('boardDiv');
        if (divElement) {
            const divWidth = divElement.offsetWidth;
            setBoardWith(divWidth * 0.7);
        }
    }, []);

    function checkValidToken() {
        const itemStr = localStorage.getItem('token');
        if (!itemStr) return false;
      
        const item = JSON.parse(itemStr);
        if (new Date().getTime() > item.expiry) {
          localStorage.removeItem('token');
          return false;
        }
        return true;
    }

    async function getOpeningsRequest() {
        try {
            const data = await getOpenings();
            setOpenings(data);
        } catch (error) {
            console.error('Fehler bei der Abfrage der Eröffnungen:', error);
        }
    }

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
    };

    async function getNextOpeningMovesRequest(id, played = "") {
        try {
            const data = await getNextOpeningMoves({ id, played });
            const filteredMoves = data.filter(move => move.move && move.move.trim() !== "");
            if(filteredMoves.length === 0) {
                setNoMoreMoves(true);
            } else {
                setNoMoreMoves(false);
            }
            setNextMoves(filteredMoves);
        } catch (error) {
            console.error('Fehler bei der Abfrage der nächsten Züge:', error);
        }
    }

    const handleForward = (index) => {
        if (index !== -1 && nextMoves[index]) {
            const move = nextMoves[index].move;

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
                console.warn("Ungültiger Zug:", move);
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


    return (
        <PageContainer>
            <ChessBoardContainer id="boardDiv">
                {boardWidth > 0 && <Chessboard
                    id="BasicBoard"
                    position={fen}
                    boardWidth={boardWidth}
                    arePiecesDraggable={false}
                />}
            </ChessBoardContainer>
            <ControlContainer>
                {moveHistory.length !== 0 && <IconButton onClick={handleBack} aria-label="Zurück" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                    <ArrowBackIcon />
                </IconButton>}

                {noMoreMoves && (
                    <OpeningEndContainer>
                        <StyledText>Die Eröffnungsvariante ist zu Ende. Möchtest du sie nun üben?</StyledText>
                        <Link to="/train">
                            <BackButton sx={buttonColor} variant="contained">Üben</BackButton>
                        </Link>
                    </OpeningEndContainer>
                )}

                <MoveScrollContainer>
                    <ScrollableMoveList>
                        {nextMoves
                            .filter((moveData) => moveData.move)
                            .map((moveData, index) => (
                                <MoveItem
                                    key={index}
                                    onClick={() => handleForward(index)}
                                >
                                    <strong>{moveData.move}</strong> - {moveData.name}
                                </MoveItem>
                            ))}
                    </ScrollableMoveList>
                </MoveScrollContainer>
            </ControlContainer>
            <OpeningContainer>
                <StyledOpeningsContainer style={{ height: selectedOpening === -1 ? '100%' : null }}>
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
        </PageContainer>
    );
}