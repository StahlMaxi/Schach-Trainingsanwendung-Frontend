import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useTheme } from "../../../theme/themeContext";
import { TextField, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import { getOpenings } from "../../../services/openingService";
import { getVariants } from "../../../services/openingService";
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

//Informationen
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

    const [startWhite, setStartWhite] = useState(true);

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
        console.log(variant);
        setVariantSearch(variant.name);
        setSelectedVariant(variant.id);
    };

    const resetSelectedVariant = () => {
        setVariantSearch("");
        setSelectedVariant(-1);
    }

    return(
        <PageContainer>
            <ChessBoardContainer id="boardDiv">
                {boardWidth > 0 && <Chessboard
                    id="BasicBoard"
                    position={fen}
                    boardWidth={boardWidth}
                />}
            </ChessBoardContainer>
            <InformationContainer>
                    
            </InformationContainer>
            <OpeningContainer>
                <StyledOpeningsContainer style={{ height: selectedOpening === -1 ? '100%' : null }}>
                    <StyledTextFieldWrapper>
                        <StyledTextField
                            id="outlined-basic"
                            value={openingSearch}
                            onChange={handleOpeningSearchChange}
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
                {selectedOpening !== -1 && (
                    <StyledOpeningsContainer>
                        <StyledTextFieldWrapper>
                            <StyledTextField
                                id="variant-search"
                                value={variantSearch}
                                onChange={(e) => setVariantSearch(e.target.value)}
                                label="Variante auswählen"
                                variant="outlined"
                            />
                            <StyledIconButton onClick={() => resetSelectedVariant()}>
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
                        <InputLabel id="color-select-label">Seite Wählen</InputLabel>
                        <Select
                            labelId="color-select-label"
                            id="color-select"
                            value={startWhite ? "white" : "black"}
                            onChange={(e) => setStartWhite(e.target.value === "white")}
                            label="Farbe wählen"
                        >
                            <MenuItem value="white">Weiß</MenuItem>
                            <MenuItem value="black">Schwarz</MenuItem>
                        </Select>
                    </FormControl>
                </StyledOpeningsContainer>}
            </OpeningContainer>
        </PageContainer>
    );
}