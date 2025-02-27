import React from "react";
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
    border-top: 2px solid transparent;
    transition: all 200ms ease-in-out;

    &:hover {
        border-top: 1px solid #2ecc71;
    }
`;

const Link = styled.a`
    text-decoration: none;
    color: inherit;
    font-size: inherit;
`;

export function NavLinks() {
    return <NavLinksContainer>
        <LinksWrapper>
            <LinkItem><Link href="#">Home</Link></LinkItem>
            <LinkItem><Link href="#">Lernen</Link></LinkItem>
            <LinkItem><Link href="#">Training</Link></LinkItem>
        </LinksWrapper>
    </NavLinksContainer>
}