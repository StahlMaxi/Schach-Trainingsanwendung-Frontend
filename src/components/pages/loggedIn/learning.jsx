import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Chessboard } from "react-chessboard";
import { TextField } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { getOpenings } from "../../../services/openingService";
import { getNextOpeningMoves } from "../../../services/openingService";

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

const OpeningContainer = styled.div`
    width: 20%;
`

const StyledOpeningsContainer = styled.div`
    background-color: ${(props) => props.theme.colors.navbar};
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    background-color: ${(props) => props.theme.colors.background};
`;

const OpeningItem = styled.div`
    padding: 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    
    &:hover {
        background-color: #f0f0f0;
    }
`;

const ControlContainer = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    background-color: ${(props) => props.theme.colors.navbar};
    margin-right: 20px;
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
    background-color: ${(props) => props.selected ? '#c8e6ff' : props.theme.colors.background};
    transition: background-color 0.2s;

    &:hover {
        background-color: #e0f7fa;
    }
`;

const SelectedMoveContainer = styled.div`
    padding: 10px;
    background-color: ${(props) => props.theme.colors.navbar};
    border-top: 2px solid #aaa;
`;

const ArrowButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;
`;

const ArrowButton = styled.button`
    padding: 10px 20px;
    font-size: 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: black;
    color: white;

    &:hover {
        background-color: #333;
    }
`;

export function LearningPage() {
    const [boardWidth, setBoardWith] = useState(0);

    const [openings, setOpenings] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedOpening, setSelectedOpening] = useState(-1);

    const [nextMoves, setNextMoves] = useState([]);
    const [playedMoves, setPlayedMoves] = useState(""); // Dies wird als gespielt verwendet

    const [selectedMoveIndex, setSelectedMoveIndex] = useState(-1);
    const [moveHistory, setMoveHistory] = useState([]);

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
        setSearch('');
        setSelectedOpening(-1);
        setNextMoves([]);
        setPlayedMoves("");
        setSelectedMoveIndex(-1);
        setMoveHistory([]);
    }

    async function getNextOpeningMovesRequest(id, played = "") {
        console.log(id);
        console.log(played);
        try {
            const data = await getNextOpeningMoves({ id, played });
            console.log(data);
            const filteredMoves = data.filter(move => move.move && move.move.trim() !== "");
            setNextMoves(filteredMoves);
        } catch (error) {
            console.error('Fehler bei der Abfrage der nächsten Züge:', error);
        }
    }

    const handleMoveSelect = (index) => {
        setSelectedMoveIndex(index);
    };

    const handleForward = () => {
        if (selectedMoveIndex !== -1 && nextMoves[selectedMoveIndex]) {
            const move = nextMoves[selectedMoveIndex].move;
            
            let newPlayedMoves;
            if(playedMoves.trim() !== "") {
                newPlayedMoves = playedMoves + ' ' + move;
            } else {
                newPlayedMoves = move;
            }
    
            setPlayedMoves(newPlayedMoves);
            setMoveHistory(prev => [...prev, move]);
    
            getNextOpeningMovesRequest(selectedOpening, newPlayedMoves);
        }
    };

    const handleBack = () => {
        if (moveHistory.length > 0) {
            setMoveHistory(prev => {
                const newHistory = [...prev];
                newHistory.pop();
    
                const newPlayedMoves = newHistory.join(' ');
                setPlayedMoves(newPlayedMoves);
    
                getNextOpeningMovesRequest(selectedOpening, newPlayedMoves);
    
                return newHistory;
            });
        }
    };

    return (
        <PageContainer>
            <ChessBoardContainer id="boardDiv">
                {boardWidth > 0 && <Chessboard id="BasicBoard" boardWidth={boardWidth} />}
            </ChessBoardContainer>
            {selectedOpening !== -1 && <ControlContainer>
                <MoveScrollContainer>
                    <ScrollableMoveList>
                        {nextMoves
                            .filter((moveData) => moveData.move)
                            .map((moveData, index) => (
                                <MoveItem
                                    key={index}
                                    selected={index === selectedMoveIndex}
                                    onClick={() => handleMoveSelect(index)}
                                >
                                    <strong>{moveData.move}</strong> - {moveData.name}
                                </MoveItem>
                            ))}
                    </ScrollableMoveList>
                </MoveScrollContainer>

                {selectedMoveIndex !== -1 && nextMoves[selectedMoveIndex] && (
                    <SelectedMoveContainer>
                        <hr />
                        <div>
                            <div><strong>Zug:</strong> {nextMoves[selectedMoveIndex].move}</div>
                            <div><strong>Variante:</strong> {nextMoves[selectedMoveIndex].name}</div>
                        </div>
                    </SelectedMoveContainer>
                )}
                <ArrowButtonContainer>
                    <ArrowButton onClick={handleBack}>&larr;</ArrowButton>

                    <StyledIconButton onClick={() => {setSelectedMoveIndex(-1)}}>
                        <DeleteIcon />
                    </StyledIconButton>

                    <ArrowButton onClick={handleForward}>&rarr;</ArrowButton>
                </ArrowButtonContainer>
            </ControlContainer>}
            <OpeningContainer>
                {selectedOpening && <StyledOpeningsContainer style={{ height: selectedOpening === -1 ? '100%' : null }}>
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
                    {selectedOpening === -1 && <OpeningScrollContainer>
                        {filteredOpenings.length === 0 ? (
                            <div>Keine Eröffnungen gefunden</div>
                        ) : (
                            filteredOpenings.map((opening, index) => (
                                <OpeningItem key={index} onClick={() => openingSelected(opening)}>
                                    {opening.name}
                                </OpeningItem>
                            ))
                        )}
                    </OpeningScrollContainer>}
                </StyledOpeningsContainer>}
            </OpeningContainer>
        </PageContainer>
    );
}