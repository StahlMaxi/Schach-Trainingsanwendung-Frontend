import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from "styled-components";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChessBackground from "../../assets/chessBackground.jpg";
import { Link } from "react-router-dom";
import { login } from "../../services/authorizationService";

const Content = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(${ChessBackground});
    background-size: cover;
    background-position: center;
`;

const FieldWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: ${(props) => props.theme.colors.navbar}; 
`;

const TextFieldWrapper = styled.div`
    width: 300px;
    margin-bottom: 50px;
`;

const PasswordWrapper = styled.div`
    width: 300px;
    margin-bottom: 50px;
`;

const StyledTextfield = styled(TextField)`
    width: 100%;
`;

const StyledFormControl = styled(FormControl)`
    width: 100%;
`;

const StyledButton = styled(Button)`
    width: 300px;
    background-color: ${(props) => props.theme.colors.backgroundCounter} !important;
    color: ${(props) => props.theme.colors.textCounter} !important;
`;

const StyledBody = styled.p`
    color: ${(props) => props.theme.colors.text};
    font-weight: ${(props) => props.theme.typography.body.fontWeight};
    font-size: ${(props) => props.theme.typography.body.fontSize};
`;

const StyledLink = styled(Link)`
    color: ${(props) => props.theme.colors.text};
`;

export function LoginPage({setLoggedIn}) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [showPwText, setShowPwText] = useState(false);

    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPwText((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    async function loginPressed() {
        try {
            await login({ name: userName, password: password });
            setLoggedIn(true);
            setUserName("");
            setPassword("");
            navigate("/");
        } catch (error) {
        console.error('Fehler beim Login:', error);
        }
    }

    return(
        <Content>
            <FieldWrapper>
                <TextFieldWrapper>
                    <StyledTextfield id="standard-basic" value={userName} onChange={(e) => setUserName(e.target.value)} label="Nutzername" variant="standard"/>
                </TextFieldWrapper>
                <PasswordWrapper>
                    <StyledFormControl variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPwText ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{ fontSize: '1.0rem' }}
                                        aria-label={showPwText ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                    >
                                        {showPwText ? (
                                            <Visibility sx={{ fontSize: '1.5rem' }} />
                                        ) : (
                                            <VisibilityOff sx={{ fontSize: '1.5rem' }} />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </StyledFormControl>
                </PasswordWrapper>
                <StyledButton variant="contained" onClick={loginPressed}>Login</StyledButton>
                <StyledBody>
                    Haben sie noch kein Konto?<br/>
                    <StyledLink to="/register">
                        Registrieren sie sich jetzt!
                    </StyledLink>
                </StyledBody>
            </FieldWrapper>
        </Content>
    );
}