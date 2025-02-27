import React from "react";
import styled from "styled-components";
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';

const SettingsIconContainer = styled.div`
    display: flex;
`;

const SettingButton = styled(IconButton)`
    padding: 10px;

    &:not(:last-of-type) {
        margin-right: 7px
    }
`;

export function SettingIcons({ isDarkMode }) {
    return(
        <SettingsIconContainer>
            <SettingButton>
                {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/>}
            </SettingButton>
            <SettingButton>
                <SettingsIcon/>
            </SettingButton>
        </SettingsIconContainer>
    );
}