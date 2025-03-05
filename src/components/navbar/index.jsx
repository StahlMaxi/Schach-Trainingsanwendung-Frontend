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
    box-shadow: 0 1px 3px rgba(15, 15, 15, 0.13);
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
`;

export function NavBar() {
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
            {!isMobile && <SettingIcons/>}
            {isMobile && <MobileNavLinks/>}
        </RightSection>
    </NavBarContainer>
}