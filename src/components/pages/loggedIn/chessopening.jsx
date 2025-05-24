import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
    height: calc(100vh - 60px);
    display: flex;
`;

export function ChessOpeningPage() {
    return (
        <PageContainer>
            Schacheröffnung
        </PageContainer>
    );
}