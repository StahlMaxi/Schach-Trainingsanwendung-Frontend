import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const AccessibilityButtonsContainer = styled.div`
    display: flex;
    margin-top: 20px;
    gap: 10px;
`;

const AccessibilityButton = styled(Button)`
    width: 150px;
`;

export function AccessibilityButtons({ closeFunction }) {
    return (
        <AccessibilityButtonsContainer>
            <Link to="/login" onClick={closeFunction}>
                <AccessibilityButton variant="outlined">Login</AccessibilityButton>
            </Link>
            <Link to="/register" onClick={closeFunction}>
                <AccessibilityButton variant="outlined">Registrieren</AccessibilityButton>
            </Link>
        </AccessibilityButtonsContainer>
    );
}