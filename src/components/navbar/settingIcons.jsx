import React from "react";
import styled from "styled-components";
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
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

export function SettingIcons(props) {
    return(
        <SettingsIconContainer>
            <SettingButton>
                <DarkModeIcon/>
            </SettingButton>
            <SettingButton>
                <SettingsIcon/>
            </SettingButton>
        </SettingsIconContainer>
    );
}