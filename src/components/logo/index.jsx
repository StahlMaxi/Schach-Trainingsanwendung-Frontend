import React from "react";
import styled from "styled-components";
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

const LogoText = styled.h2`
    font-size: 16px;
    margin: 0;
    margin-left: 4px;
    color: #222;
    font-weight: 500;
`;

export function Logo(props) {
    return <LogoWrapper>
        <LogoImg><img src={ChessLogoBlack} alt="Chess Logo"/></LogoImg>
        <LogoText>Chess Openings</LogoText>
    </LogoWrapper>
}