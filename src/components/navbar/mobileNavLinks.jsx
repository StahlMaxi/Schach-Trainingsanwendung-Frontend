import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useTheme } from "../../theme/themeContext";
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
    background-color: ${(props) => props.theme.colors.background};
    width: 100%;
    flex-direction: column;
    position: fixed;
    top: 65px;
    left: 0;
`;

const LinkItem = styled.li`
    width: auto;
    padding: 0 1.1em;
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.h3.fontWeight};
    font-size: ${(props) => props.theme.typography.h3.fontSize};
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    font-size: inherit;
`;

export function MobileNavLinks() {
    const [isOpen, setOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const closeMenu = () => setOpen(false);

    return <NavLinksContainer>
        <MenuToggle isOpen={isOpen} toggle={() => setOpen(!isOpen)}/>
        {isOpen && <LinksWrapper>
            <LinkItem><StyledLink to="/" onClick={closeMenu}>Home</StyledLink></LinkItem>
            <LinkItem><StyledLink to="/learn" onClick={closeMenu}>Lernen</StyledLink></LinkItem>
            <LinkItem><StyledLink to="/train" onClick={closeMenu}>Training</StyledLink></LinkItem>
            <LinkItem><StyledLink to="/settings" onClick={closeMenu}>Einstellungen</StyledLink></LinkItem>
            <IconButton onClick={toggleTheme}>
                {theme.name === 'dark' ? <LightModeIcon/> : <DarkModeIcon/>}
            </IconButton>
            <AccessibilityButtons/>
        </LinksWrapper>}
    </NavLinksContainer>
}