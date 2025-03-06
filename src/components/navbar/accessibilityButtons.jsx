import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";

const AccessibilityButtonsContainer = styled.div`
    display: flex;
    margin-top: 20px;
    gap: 10px;
`;

const AccessibilityButton = styled(Button)`
    width: 150px;
`;

export function AccessibilityButtons() {

    return(
        <AccessibilityButtonsContainer>
            <AccessibilityButton variant="outlined">Login</AccessibilityButton>
            <AccessibilityButton variant="outlined">Registrieren</AccessibilityButton>
        </AccessibilityButtonsContainer>
    );
}