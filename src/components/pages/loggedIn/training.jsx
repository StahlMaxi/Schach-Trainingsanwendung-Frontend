import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useTheme } from "../../../theme/themeContext";
import { TextField, IconButton, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getOpenings, getVariants, getNextVariantMove } from "../../../services/openingService";

const PageContainer = styled.div`
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.background};
    padding: 50px;
`;

const ChessBoardContainer = styled.div`
    width: 60%;
    padding-left: 150px;
`;

const InformationContainer = styled.div`
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

const StyledButton = styled(Button)`
    width: 100%;
    height: 50px;
`;

export function TrainingPage() {
    const theme = useTheme();

    const [boardWidth, setBoardWith] = useState(0);
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState("start");

    const [openings, setOpenings] = useState([]);
    const [variants, setVariants] = useState([]);
    const [openingSearch, setOpeningSearch] = useState("");
    const [selectedOpening, setSelectedOpening] = useState(-1);
    const [variantSearch, setVariantSearch] = useState("");
    const [selectedVariant, setSelectedVariant] = useState(-1);

    const [startWhite, setStartWhite] = useState(null);
    const [playedMoves, setPlayedMoves] = useState("");

    const [gameText, setGameText] = useState("");
    const [errors, setErrors] = useState(0);
    const [hints, setHints] = useState(0);

    const [nextExpectedPlayerMove, setNextExpectedPlayerMove] = useState("");

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
        setSelectedOpening(opening.id);
        getVariantsRequest(opening.id);
    }

    const resetSelectedOpening = () => {
        const freshGame = new Chess();
        setGame(freshGame);
        setFen(freshGame.fen());

        setOpeningSearch("");
        setVariantSearch("");
        setSelectedOpening(-1);
        setSelectedVariant(-1);

        resetGame();
    };

    async function getVariantsRequest(openingId) {
        try {
            const data = await getVariants(openingId);
            setVariants(data);
        } catch (error) {
            console.error('Fehler bei der Abfrage der Eröffnungen:', error);
        }
    }

    const filteredVariants = () => {
        const lowerSearch = variantSearch.toLowerCase();
        return variants.filter(variant =>
            variant.name?.toLowerCase().includes(lowerSearch)
        );
    };

    const variantSelected = (variant) => {
        setVariantSearch(variant.name);
        setSelectedVariant(variant.id);
    };

    const resetSelectedVariant = () => {
        setVariantSearch("");
        setSelectedVariant(-1);
        
        resetGame();
    }

    const startingSelected = (startPosition) => {
        if(startPosition !== '') {
            const startsWhite = startPosition === "white" ? true : false;
            setStartWhite(startsWhite);
        }
    }

    const startGame = async () => {
        const freshGame = new Chess();
        setGame(freshGame);
        setFen(freshGame.fen());
        setPlayedMoves("");

        if(startWhite) {
            const variantData = await getNextVariantMoveRequest(selectedVariant, "");
            const nextMove = variantData?.move;

            if (!nextMove) {
                setGameText("Die Variante ist zu Ende.");
                return;
            } else {
                setNextExpectedPlayerMove(nextMove);
            }
        }

        setGameText(startWhite ? "Du bist am Zug." : "Computer beginnt...");

        if (!startWhite) {
            setTimeout(async () => {
                await handleComputerTurn();
            }, 500);
        }
    };

    async function getNextVariantMoveRequest(id, played = "") {
        console.log("Get Moves: " + played);
        try {
            const data = await getNextVariantMove({ id, played });
            console.log(data.move);
            return data;
        } catch (error) {
            console.error('Fehler bei der Abfrage der nächsten Züge:', error);
        }
    }

    const handlePlayerTurn = async (from, to) => {
        let attemptedMove;
        try {
            attemptedMove = new Chess(game.fen()).move({ from, to, promotion: "q" })?.san;
        } catch (err) {
            setGameText("Ungültiger Zug. Bitte einen legalen Zug machen.");
            return false;
        }
        const expectedMove = new Chess(game.fen()).move(nextExpectedPlayerMove, { sloppy: true })?.san;

        if (attemptedMove === expectedMove) {
            const gameCopy = new Chess(game.fen());
            gameCopy.move(nextExpectedPlayerMove, { sloppy: true });

            const updatedMoves = playedMoves + (playedMoves ? "," : "") + nextExpectedPlayerMove;

            setGame(gameCopy);
            setFen(gameCopy.fen());
            setPlayedMoves(updatedMoves);

            setGameText("Richtiger Zug! Jetzt ist der Computer dran.");

            setTimeout(async () => {
                await handleComputerTurn(gameCopy, updatedMoves);
            }, 500);
            return true;
        } else {
            setErrors(errors + 1);
            setGameText("Falscher Zug. Versuche es nochmal.");
            return false;
        }
    };

    const handleComputerTurn = async (playerGame = game, currentMoves = playedMoves) => {
        const variantData = await getNextVariantMoveRequest(selectedVariant, currentMoves);
        const nextMove = variantData?.move;

        if (!nextMove) {
            setGameText("Die Variante ist zu Ende.");
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

        const newVariantData = await getNextVariantMoveRequest(selectedVariant, updatedMoves);
        const newNextMove = newVariantData?.move;

        if(!newNextMove) {
            setGameText("Die Variante ist zu Ende.");
            return;
        } else {
            setNextExpectedPlayerMove(newNextMove);
            setGameText("Dein Zug!");
        }
    };

    const resetGame = () => {
        const freshGame = new Chess();

        setGame(freshGame);
        setFen(freshGame.fen());
        setPlayedMoves("");

        setStartWhite(null);
        setNextExpectedPlayerMove(null);

        setGameText("");
        setErrors(0);
        setHints(0);
    };


    return(
        <PageContainer>
            <ChessBoardContainer id="boardDiv">
                {boardWidth > 0 && <Chessboard
                    id="BasicBoard"
                    position={fen}
                    boardWidth={boardWidth}
                    boardOrientation={startWhite ? "white" : "black"}
                    onPieceDrop={(sourceSquare, targetSquare) => {
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
                <h3>{gameText}</h3>
                <p>Anzahl Fehler: {errors}</p>
                <p>Anzahl Hinweise: {hints}</p>
            </InformationContainer>
            <OpeningContainer>
                <StyledOpeningsContainer style={{ height: selectedOpening === -1 ? '100%' : null }}>
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
                    {selectedOpening === -1 && (
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
                {selectedOpening !== -1 && (
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
                        {selectedVariant === -1 && (
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
                {selectedVariant !== -1 && <StyledOpeningsContainer>
                    <FormControl fullWidth variant="outlined" style={{ marginTop: '20px' }}>
                        <InputLabel id="color-select-label">Startseite wählen</InputLabel>
                        <Select
                            labelId="color-select-label"
                            id="color-select"
                            value={startWhite === null ? "" : startWhite ? "white" : "black"}
                            onChange={(e) => startingSelected(e.target.value)}
                            label="Farbe w\u00e4hlen"
                        >
                            <MenuItem value="">-</MenuItem>
                            <MenuItem value="white">Weiß</MenuItem>
                            <MenuItem value="black">Schwarz</MenuItem>
                        </Select>
                    </FormControl>
                    <StyledButton sx={buttonColor} onClick={startGame} variant="contained">Start</StyledButton>
                </StyledOpeningsContainer>}
            </OpeningContainer>
        </PageContainer>
    );
}