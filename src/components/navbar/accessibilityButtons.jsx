import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";

const AccessibilityButtonsContainer  = styled.div`
    display: flex;
    margin-top: 20px;
    gap: 10px;
`;

const AccessibilityButton = styled(Button)`
    width: 150px;
    padding: 8px 1em;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    border-radius: 20px;
    cursor: pointer;
`;

export function AccessibilityButtons() {
    return(
        <AccessibilityButtonsContainer>
            <AccessibilityButton variant="outlined">Login</AccessibilityButton>
            <AccessibilityButton variant="outlined">Registrieren</AccessibilityButton>
        </AccessibilityButtonsContainer>
    );
}