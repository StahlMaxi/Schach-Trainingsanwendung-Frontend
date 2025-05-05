import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Chessboard } from "react-chessboard";
import { TextField } from "@mui/material";

import { getOpenings } from "../../../services/openingService";

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

const OpeningScrollContainer = styled.div`
    height: 500px;
    overflow-y: scroll;  // Ermöglicht das Scrollen innerhalb des Containers
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
            setOpenings(data);
        } catch (error) {
            console.error('Fehler bei der Abfrage der Eröffnungen:', error);
        }
    }

    const filteredOpenings = openings.filter(opening =>
        opening.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <PageContainer>
            <ContentContainer>
                <ChessBoardContainer id="boardDiv">
                        {boardWidth > 0 && <Chessboard id="BasicBoard" boardWidth={boardWidth} />}
                    </ChessBoardContainer>
                    <ControlContainer>
                        <TextField 
                            id="outlined-basic" 
                            value={search}
                            onChange={handleSearchChange}
                            label="Eröffnung auswählen" 
                            variant="outlined" 
                        />
                        <OpeningScrollContainer>
                            {filteredOpenings.length === 0 ? (
                                <div>Keine Eröffnungen gefunden</div>
                            ) : (
                                filteredOpenings.map((opening, index) => (
                                    <OpeningItem key={index}>
                                        {opening.name}
                                    </OpeningItem>
                                ))
                            )}
                        </OpeningScrollContainer>
                    </ControlContainer>
            </ContentContainer>
            <FooterContainer>

            </FooterContainer>
        </PageContainer>
    );
}