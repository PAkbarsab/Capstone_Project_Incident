import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  CssBaseline,
  IconButton,
  Box,
} from "@mui/material";
import { Link, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Home.jsx";
import About from "./About.jsx";
import NotFound from "./NotFound.jsx";
import styles from "./App.module.css";
import { AuthContext } from "./AuthProvider.jsx";
import { useContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#1976d2",
          },
          background: {
            default: darkMode ? "#121212" : "#f4f6f9",
            paper: darkMode ? "#1d1d1d" : "#ffffff",
          },
        },
        typography: {
          fontFamily: "Inter, Roboto, sans-serif",
        },
      }),
    [darkMode]
  );

  function Layout() {
    const { isLogged, logout, login } = useContext(AuthContext);

    return (
      <>
        <AppBar position="static" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between", py: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Incident Management App
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() => setDarkMode((prev) => !prev)}
                color="inherit"
                sx={{ border: "1px solid", borderRadius: "12px", px: 1.5 }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {isLogged ? (
                <>
                  <Link className={styles.link} to="/">Home</Link>
                  <Link className={styles.link} to="/about">About</Link>
                  <Link className={styles.link} to="/does-not-exist">404 Test</Link>
                  <Link className={styles.link} onClick={logout}>Logout</Link>
                </>
              ) : (
                <Link className={styles.link} onClick={login}>
                  Login with ServiceNow
                </Link>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 6 }}>
          <Outlet />
        </Container>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
