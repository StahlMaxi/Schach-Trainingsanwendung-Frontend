import React, { useState } from "react";
import styled from "styled-components";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

export function LoginPage({ setLoggedIn }) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPwText, setShowPwText] = useState(false);

    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPwText((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();
    const handleMouseUpPassword = (event) => event.preventDefault();

    const showSnackbar = (message, severity = "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    async function loginPressed() {
        if (!userName.trim() || !password.trim()) {
            showSnackbar("Bitte geben Sie sowohl Benutzername als auch Passwort ein.", "warning");
            return;
        }

        setLoading(true);
        try {
            await login({ name: userName, password });
            setLoggedIn(true);
            setUserName("");
            setPassword("");
            navigate("/");
        } catch (error) {
            let message = "Login fehlgeschlagen. Bitte versuchen Sie es erneut.";
            if (error.status === 401) {
                message = "Falsches Passwort.";
            } else if (error.status === 404) {
                message = "Nutzer nicht gefunden.";
            }

            showSnackbar(message, "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Content>
            <FieldWrapper>
                <StyledForm onSubmit={(e) => { e.preventDefault(); loginPressed(); }}>
                    <TextFieldWrapper>
                        <StyledTextfield
                            id="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            label="Nutzername"
                            variant="standard"
                            disabled={loading}
                            autoComplete="username"
                        />
                    </TextFieldWrapper>
                    <PasswordWrapper>
                        <StyledFormControl variant="standard">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPwText ? "text" : "password"}
                                disabled={loading}
                                autoComplete="current-password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPwText ? "hide the password" : "display the password"}
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPwText ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </StyledFormControl>
                    </PasswordWrapper>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <StyledButton variant="contained" type="submit">
                            Login
                        </StyledButton>
                    )}
                    <StyledBody>
                        Haben sie noch kein Konto?<br />
                        <StyledLink to="/register">
                            Registrieren sie sich jetzt!
                        </StyledLink>
                    </StyledBody>
                </StyledForm>
            </FieldWrapper>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Content>
    );
}