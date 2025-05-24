import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { TextField, IconButton } from "@mui/material";
import { DeviceSize } from "../../responsive";
import DeleteIcon from '@mui/icons-material/Delete';

import { getOpenings, getVariants } from "../../../services/openingService";
import { getOpeningStatistics, getVariantStatistics } from "../../../services/statisticsService";

const PageContainer = styled.div`
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: row;

    @media (max-width: ${DeviceSize.laptop}px) {
        flex-direction: column;
    }
`;

//Left
const LeftContainer = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px;

    @media (max-width: ${DeviceSize.laptop}px) {
        width: 100%;
    }
`;

const RankingContainer = styled.div`
    height: 100%;
    width: 75%;
`;

const RankingScrollContainer = styled.div`
    height: 90%;
    overflow-y: auto;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: ${(props) => props.theme.colors.navbar};
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
`;

const RankingEntry = styled.div`
    margin-bottom: 20px;
    padding: 16px 20px;
    border-radius: 12px;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.02);
    }  
`;

const RankingH2 = styled.h2`
    margin-bottom: 20px;
    margin-top: 0px;
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.h2.fontWeight};
    font-size: ${(props) => props.theme.typography.h2.fontSize};
`;

const Highlight = styled.span`
    font-weight: bold;
`;

//Right
const RightContainer = styled.div`
    width: 50%;
    height: 100%;
    display: flex,
    flex-direction: column;
    padding: 50px;

    @media (max-width: ${DeviceSize.laptop}px) {
        width: 100%;
    }
`

const TextFieldContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 50px;

    @media (max-width: ${DeviceSize.mobile}px) {
        flex-direction: column;
        gap: 10px;
        align-items:center;
        justify-content: center;
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
    max-height: 50vh;
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

const VariantStatisticContainer = styled.div`
  height: auto;
  padding: 30px;
  background-color: ${(props) => props.theme.colors.navbar || '#f7f7f7'};
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  margin-top: 20px;
`;

const VariantTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.text};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
`;

const StatBlock = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 6px;
`;

const Value = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

export function StatisticsPage({ handleLogOut }) {
    const [statistics, setStatistics] = useState([]);
    const sortedStatistics = [...statistics].sort((a, b) => a.expertise - b.expertise);

    const [openings, setOpenings] = useState([]);
    const [variants, setVariants] = useState([]);
    const [openingSearch, setOpeningSearch] = useState("");
    const [selectedOpeningId, setSelectedOpeningId] = useState(-1);
    const [variantSearch, setVariantSearch] = useState("");
    const [selectedVariantId, setSelectedVariantId] = useState(-1);

    const [selectedVariantStatistic, setSelectedVariantStatistic] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

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

    const getVariantsRequest = useCallback(async (openingId) => {
        try {
            const data = await getVariants(openingId);
            setVariants(data);
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
    }, [handleLogOut]);

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

    useEffect(() => {
        getStatistics();
        getOpeningsRequest();
    }, [getStatistics, getOpeningsRequest]); 

    const showSnackbar = (message, severity = "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleRankingClick = (variantStatistic) => {
        const variantBaseName = variantStatistic.openingName.split(":")[0].trim();  
        const opening = openings.find((opening) => opening.name === variantBaseName);

        if(opening) {
            setSelectedOpeningId(opening.id);
            setOpeningSearch(variantBaseName);
            setSelectedVariantId(variantStatistic.openingId);
            setVariantSearch(variantStatistic.openingName);
            setSelectedVariantStatistic(variantStatistic);
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
        setSelectedOpeningId(opening.id);
        getVariantsRequest(opening.id);
    }

    const resetSelectedOpening = () => {
        setOpeningSearch("");
        setVariantSearch("");
        setSelectedOpeningId(-1);
        setSelectedVariantId(-1);
        setSelectedVariantStatistic(null);
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
        getVariantStatisticsRequest(variant.id)
    };

    const resetSelectedVariant = () => {
        setVariantSearch("");
        setSelectedVariantId(-1);
        setSelectedVariantStatistic(null);
    }

    const getVariantStatisticsRequest = async (variantId) => {
        try {
            const data = await getVariantStatistics(variantId);
            setSelectedVariantStatistic(data);
        } catch (error) {
            let message;
            if (error.status === 401) {
                message = "Sie sind nicht autorisiert für diesen Endpunkt.";
                handleLogOut();
            } else if (error.status === 404) {
                message = "Es gibt keine Statistiken für diese Variante";
                handleLogOut();
            } else {
                message = "Fehler beim Abruf der Statistiken.";
            }
            showSnackbar(message, "error");
        }
    }

    return (
        <PageContainer>
            <LeftContainer>
                <RankingContainer>
                    <RankingH2>Deine bereits geübten Eröffnungen</RankingH2> 
                    <RankingScrollContainer>
                        {sortedStatistics.map((stat, index) => (
                            <RankingEntry
                                key={stat.openingId}
                                onClick={() => handleRankingClick(stat)}
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
            </LeftContainer>
            <RightContainer>
                <TextFieldContainer>
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
                </TextFieldContainer>
                {selectedVariantStatistic && <VariantStatisticContainer>
                    <VariantTitle>{selectedVariantStatistic.openingName}</VariantTitle>
                    <StatsGrid>
                        <StatBlock>
                        <Label>Ø Fehler</Label>
                        <Value>{selectedVariantStatistic.avgErrors.toFixed(2)}</Value>
                        </StatBlock>
                        <StatBlock>
                        <Label>Ø Tipps</Label>
                        <Value>{selectedVariantStatistic.avgHints.toFixed(2)}</Value>
                        </StatBlock>
                        <StatBlock>
                        <Label>Expertise</Label>
                        <Value>{(selectedVariantStatistic.expertise * 100).toFixed(1)}%</Value>
                        </StatBlock>
                        <StatBlock>
                        <Label>Perfekte Durchläufe</Label>
                        <Value>{selectedVariantStatistic.perfectRuns}</Value>
                        </StatBlock>
                        <StatBlock>
                        <Label>Mit Tipp</Label>
                        <Value>{selectedVariantStatistic.hintedRuns}</Value>
                        </StatBlock>
                        <StatBlock>
                        <Label>Fehlversuche</Label>
                        <Value>{selectedVariantStatistic.failedRuns}</Value>
                        </StatBlock>
                        <StatBlock>
                        <Label>Gesamt</Label>
                        <Value>{selectedVariantStatistic.totalRuns}</Value>
                        </StatBlock>
                    </StatsGrid>
                    </VariantStatisticContainer>}
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