import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { AccessibilityButtons } from "./accessibilityButtons";
import { MenuToggle } from "./menuToggle";
import { IconButton } from "@mui/material";
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

const Link = styled.a`
    text-decoration: none;
    color: inherit;
    font-size: inherit;
`;

export function MobileNavLinks({ isDarkMode }) {
    const [isOpen, setOpen] = useState(false);

    return <NavLinksContainer>
        <MenuToggle isOpen={isOpen} toggle={() => setOpen(!isOpen)}/>
        {isOpen && <LinksWrapper>
            <LinkItem><Link href="#">Home</Link></LinkItem>
            <LinkItem><Link href="#">Lernen</Link></LinkItem>
            <LinkItem><Link href="#">Training</Link></LinkItem>
            <LinkItem><Link href="#">Einstellungen</Link></LinkItem>
            <IconButton>
                {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/>}
            </IconButton>
            <AccessibilityButtons/>
        </LinksWrapper>}
    </NavLinksContainer>
}