import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import styled from "styled-components";
import { Button } from "@mui/material";
import ChessBackground from "../../assets/chessBackground.jpg";
import { register } from "../../services/authorizationService";
import { useNavigate } from "react-router-dom";

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
    gap: 50px;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: ${(props) => props.theme.colors.navbar}; 
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 50px;
    justify-content: center;
    align-items: center;
`;

const TextFieldWrapper = styled.div`
    width: 300px;
`;

const PasswordWrapper = styled.div`
    width: 300px;
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

export function RegistrationPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [showPwText, setShowPwText] = useState(false);
    const [showConfText, setShowConfText] = useState(false);

    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const navigate = useNavigate();

    const handleCloseSnackbar = (_, reason) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };

    const showSnackbar = (message, severity = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    async function registerButtonPressed() {
        if (!userName.trim() || !password.trim() || !passwordConfirmation.trim()) {
            showSnackbar("Bitte alle Felder ausfüllen.", "warning");
            return;
        }

        if (password !== passwordConfirmation) {
            showSnackbar("Passwörter stimmen nicht überein.", "warning");
            return;
        }

        setLoading(true);
        try {
            await register({ name: userName, password });
            setUserName("");
            setPassword("");
            setPasswordConfirmation("");
            showSnackbar("Registrierung erfolgreich!", "success");
            setTimeout(() => navigate("/login"), 500);
        } catch (error) {
            let message;
            if (error.status === 409) {
                message = "Nutzername bereits vergeben.";
            } else {
                message = "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.";
            }
            showSnackbar(message, "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Content>
            <FieldWrapper>
                <StyledForm onSubmit={(e) => { e.preventDefault(); registerButtonPressed(); }}>
                    <TextFieldWrapper>
                        <StyledTextfield
                            label="Nutzername"
                            variant="standard"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={loading}
                            autoComplete="username"
                        />
                    </TextFieldWrapper>
                    <PasswordWrapper>
                        <StyledFormControl variant="standard">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"
                                type={showPwText ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="new-password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPwText(!showPwText)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {showPwText ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </StyledFormControl>
                    </PasswordWrapper>
                    <PasswordWrapper>
                        <StyledFormControl variant="standard">
                            <InputLabel htmlFor="passwordConfirmation">Password Bestätigung</InputLabel>
                            <Input
                                id="passwordConfirmation"
                                type={showConfText ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                disabled={loading}
                                autoComplete="new-password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfText(!showConfText)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {showConfText ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </StyledFormControl>
                    </PasswordWrapper>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <StyledButton variant="contained" type="submit">
                                Registrieren
                            </StyledButton>
                        )}
                    </div>
                </StyledForm>
            </FieldWrapper>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Content>
    );
}