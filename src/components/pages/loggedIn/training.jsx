import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useTheme } from "../../../theme/themeContext";

const PageContainer = styled.div`
    height: calc(100vh - 60px); 
    display: flex;
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.background};
    padding: 50px;
    padding-left: 200px;
`;

//Schachbrett
const ChessBoardContainer = styled.div`
    width: 50%;
    background-color: orange;
`;

//Varianten auswählen
const InformationContainer = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    background-color: green;
`;

export function TrainingPage() {
    const theme = useTheme();
    
    const [boardWidth, setBoardWith] = useState(0);
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState("start");

    useLayoutEffect(() => {
        const divElement = document.getElementById('boardDiv');
        if (divElement) {
            const divWidth = divElement.offsetWidth;
            setBoardWith(divWidth * 0.9);
        }
    }, []);

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
                    Test
            </InformationContainer>
        </PageContainer>
    );
}