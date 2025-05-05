import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Chessboard } from "react-chessboard";
import { TextField } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { getOpenings } from "../../../services/openingService";
import { getNextOpeningMoves } from "../../../services/openingService";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
`;

const ContentContainer = styled.div`
    height: 85%;
    display: flex;
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.background};
    padding: 50px;
`;

const FooterContainer = styled.div`
    height: 15%;
    background-color: ${(props) => props.theme.colors.navbar};
    padding: 20px;
`;

const ChessBoardContainer = styled.div`
    width: 60%;
    padding-left: 150px;
`;

const ControlContainer = styled.div`
    width: 40%;
`;

const StyledOpeningsContainer = styled.div`
    width: 400px;
    float: right;
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

export function LearningPage() {
    const [boardWidth, setBoardWith] = useState(0);

    const [openings, setOpenings] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedOpening, setSelectedOpening] = useState(-1);

    useLayoutEffect(() => {
        const tokenCorrect = checkValidToken();
        if (tokenCorrect) {
            getOpeningsRequest();
        }

        const divElement = document.getElementById('boardDiv');
        if (divElement) {
            const divWidth = divElement.offsetWidth;
            setBoardWith(divWidth * 0.6);
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
            console.log(data);
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
    }

    async function getNextOpeningMovesRequest(id) {
        try {
            const data = await getNextOpeningMoves({ id });
            console.log(data);
        } catch (error) {
            console.error('Fehler bei der Abfrage der nächsten Züge:', error);
        }
    }

    return (
        <PageContainer>
            <ContentContainer>
                <ChessBoardContainer id="boardDiv">
                        {boardWidth > 0 && <Chessboard id="BasicBoard" boardWidth={boardWidth} />}
                    </ChessBoardContainer>
                    <ControlContainer>
                        {selectedOpening && <StyledOpeningsContainer style={{ height: selectedOpening === -1 ? '100%' : null}}>
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
                    </ControlContainer>
            </ContentContainer>
            <FooterContainer>

            </FooterContainer>
        </PageContainer>
    );
}