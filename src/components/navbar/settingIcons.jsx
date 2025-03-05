import React from "react";
import styled from "styled-components";
import { useTheme } from "../../theme/themeContext";
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";

const SettingsIconContainer = styled.div`
    display: flex;
`;

const SettingButton = styled(IconButton)`
    padding: 10px;

    &:not(:last-of-type) {
        margin-right: 7px
    }
`;

export function SettingIcons() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate("/settings");
    };

    return(
        <SettingsIconContainer>
            <SettingButton onClick={toggleTheme}>
                {theme.name === 'dark' ? <LightModeIcon/> : <DarkModeIcon/>}
            </SettingButton>
            <SettingButton onClick={handleSettingsClick}>
                <SettingsIcon/>
            </SettingButton>
        </SettingsIconContainer>
    );
}