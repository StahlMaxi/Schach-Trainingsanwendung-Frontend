import React from "react";
import { useMediaQuery } from "react-responsive";
import styled, { useTheme } from "styled-components";
import { Logo } from "../logo";
import { DeviceSize } from "../responsive";
import { MobileNavLinks } from "./mobileNavLinks";
import { NavLinks } from "./navLinks";
import { SettingIcons } from "./settingIcons";

const NavBarContainer = styled.div`
    width: 100%;
    height: 60px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background-color: ${(props) => props.theme.colors.navbar};
    display: flex;
    align-items: center;
    padding: 0 1.5em;
    box-sizing: border-box;
`;

const LeftSection = styled.div`
    display: flex;
    padding-left: 20px;
`;

const MiddleSection = styled.div`
    display: flex;
    flex: 2;
    height: 100%;
    justify-content: center;
`;

const RightSection = styled.div`
    display: flex;
    padding-right: 20px;
    align-items: center;
`;

const StyledH3 = styled.h3`
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.h3.fontWeight};
    font-size: ${(props) => props.theme.typography.h3.fontSize};
    margin-left: 15px; /* Abstand zwischen den Icons und dem Namen */
`;

export function NavBar({ setNavBarOpen, isLoggedIn, userName, handleLogOut }) {
    const { theme } = useTheme();
    const isMobile = useMediaQuery({ maxWidth: DeviceSize.mobile });

    return <NavBarContainer theme={theme}>
        <LeftSection>
            <Logo/>
        </LeftSection>
        <MiddleSection>
            {!isMobile && <NavLinks/>}
        </MiddleSection>
        <RightSection>
            {!isMobile && <SettingIcons isLoggedIn={isLoggedIn} handleLogOut={handleLogOut}/>}
            {!isMobile && <StyledH3>{userName}</StyledH3>}
            {isMobile && <MobileNavLinks setNavBarOpen={setNavBarOpen}/>}
        </RightSection>
    </NavBarContainer>
}