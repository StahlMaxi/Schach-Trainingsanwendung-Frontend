import React from "react";
import styled from "styled-components";
import { useTheme } from "../../theme/themeContext";
import ChessLogoWhite from "../../assets/logo/chessIconWhite.png";
import ChessLogoBlack from "../../assets/logo/chessIconBlack.png";

const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const LogoImg = styled.div`
    width: 29px;
    height: 29px;
    
    img {
        width: 100%;
        height: 100%;
    }
`;

const LogoText = styled.h3`
    font-size: ${(props) => props.theme.typography.h3.fontSize};
    font-weight: ${(props) => props.theme.typography.h3.fontWeight};
    margin: 0;
    margin-left: 4px;
    color: ${(props) => props.theme.colors.text};
`;

export function Logo() {
    const { theme } = useTheme();
    const logoSrc = theme.name === 'dark' ? ChessLogoWhite : ChessLogoBlack;

    return <LogoWrapper>
        <LogoImg>
            <img src={logoSrc} alt="Chess Logo"/>
        </LogoImg>
        <LogoText>Chess Openings</LogoText>
    </LogoWrapper>
}