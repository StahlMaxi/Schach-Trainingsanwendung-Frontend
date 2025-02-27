import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { AccessibilityButtons } from "./accessibilityButtons";
import { MenuToggle } from "./menuToggle";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const NavLinksContainer = styled.div`
    height: 100%;
    display: flex;
`;

const LinksWrapper = styled.ul`
    margin: 15px 0 0 0;
    padding: 0;
    display: flex;
    align-items: center;
    height: 100%;
    list-style: none;
    background-color: #fff;
    width: 100%;
    flex-direction: column;
    position: fixed;
    top: 65px;
    left: 0;
`;

const LinkItem = styled.li`
    width: auto;
    padding: 0 1.1em;
    color: #222;
    font-weight: 500;
    font-size: 20px;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    font-size: inherit;
`;

export function MobileNavLinks({ isDarkMode }) {
    const [isOpen, setOpen] = useState(false);

    const closeMenu = () => setOpen(false);

    return <NavLinksContainer>
        <MenuToggle isOpen={isOpen} toggle={() => setOpen(!isOpen)}/>
        {isOpen && <LinksWrapper>
            <LinkItem><StyledLink to="/" onClick={closeMenu}>Home</StyledLink></LinkItem>
            <LinkItem><StyledLink to="/learn" onClick={closeMenu}>Lernen</StyledLink></LinkItem>
            <LinkItem><StyledLink to="/train" onClick={closeMenu}>Training</StyledLink></LinkItem>
            <LinkItem><StyledLink to="/settings" onClick={closeMenu}>Einstellungen</StyledLink></LinkItem>
            <IconButton>
                {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/>}
            </IconButton>
            <AccessibilityButtons/>
        </LinksWrapper>}
    </NavLinksContainer>
}