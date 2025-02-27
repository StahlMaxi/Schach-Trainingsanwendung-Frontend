import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const NavLinksContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
`;

const LinksWrapper = styled.ul`
    margin: 0;
    padding: 0;
    display: flex;
    height: 100%;
    list-style: none;
`;

const LinkItem = styled.li`
    height: 100%;
    padding: 0 1.1em;
    color: #222;
    font-weight: 500;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid transparent;
    transition: all 200ms ease-in-out;
    background-color: ${({ isActive }) => (isActive ? "#d3d3d3" : "transparent")};

    &:hover {
        border-bottom: 1px solid #2ecc71;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    font-size: inherit;
`;

export function NavLinks() {
    const { pathname } = useLocation();

    return <NavLinksContainer>
        <LinksWrapper>
            <LinkItem isActive={pathname === "/"}>
                <StyledLink to="/">Home</StyledLink>
            </LinkItem>
            <LinkItem isActive={pathname === "/learn"}>
                <StyledLink to="/learn">Lernen</StyledLink>
            </LinkItem>
            <LinkItem isActive={pathname === "/train"}>
                <StyledLink to="/train">Training</StyledLink>
            </LinkItem>
        </LinksWrapper>
    </NavLinksContainer>
}