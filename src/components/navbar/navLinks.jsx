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
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.h3.fontWeight};
    font-size: font-size: ${(props) => props.theme.typography.h3.fontSize};
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid transparent;
    transition: all 200ms ease-in-out;
    background-color: ${(props) =>
        props.active ? props.theme.colors.selected : "transparent"};

     &:hover {
    background-color: ${(props) =>
      props.active
        ? props.theme.colors.selectedHover
        : props.theme.colors.hover};
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
            <LinkItem active={pathname === "/" }>
                <StyledLink to="/">Home</StyledLink>
            </LinkItem>
            <LinkItem active={pathname === "/learn"}>
                <StyledLink to="/learn">Lernen</StyledLink>
            </LinkItem>
            <LinkItem active={pathname === "/train"}>
                <StyledLink to="/train">Training</StyledLink>
            </LinkItem>
        </LinksWrapper>
    </NavLinksContainer>
}