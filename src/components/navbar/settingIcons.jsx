import React from "react";
import styled from "styled-components";
import { useTheme } from "../../theme/themeContext";
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const SettingsIconContainer = styled.div`
    display: flex;
`;

const SettingButton = styled(IconButton)`
    padding: 10px;

    &:not(:last-of-type) {
        margin-right: 7px
    }
`;

export function SettingIcons({ isLoggedIn, handleLogOut }) {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogIn = () => {
        navigate("/login");
    }

    return(
        <SettingsIconContainer>
            <SettingButton onClick={toggleTheme}>
                {theme.name === 'dark' ? <LightModeIcon/> : <DarkModeIcon/>}
            </SettingButton>
            <SettingButton onClick={isLoggedIn ? handleLogOut : handleLogIn}>
                {isLoggedIn ? <LogoutIcon/> : <LoginIcon/>}
            </SettingButton>
        </SettingsIconContainer>
    );
}