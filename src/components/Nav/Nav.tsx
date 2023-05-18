import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import DiamondIcon from "@mui/icons-material/Diamond";
import { AccountDetails } from "../../ledgers/KeplrLedger";
import { useNavigate } from "react-router-dom";

interface NavProps {
  connect: () => Promise<void>;
  account: AccountDetails | null;
  disconnect: () => void;
  isConnected: boolean;
}

function Nav({ connect, account, disconnect, isConnected }: NavProps) {
  const navigate = useNavigate();
  
  const goToCollection = () => {
    if (account) {
      handleCloseNavMenu();
      navigate("/collections");
    }
  };

  const goToMintPage = () => {
    handleCloseNavMenu();
    if (account !== null) {
      navigate("/mint");
    }
  };

  const goToHomePage = () => {
    handleCloseNavMenu();
    navigate("/");
  };
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        height: "5em",
        backgroundColor: "primary.dark",
        marginBottom: "5em",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DiamondIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            REIFIED
          </Typography>

          {isConnected && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={goToCollection}>
                  <Typography textAlign="center">Assets</Typography>
                </MenuItem>

                <MenuItem
                  onClick={(event) => {
                    event.preventDefault();
                    goToMintPage();
                  }}
                >
                  <Typography textAlign="center">Mint</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}

          <DiamondIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            REIFIED
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isConnected && (
              <>
              <Button
                onClick={goToCollection}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Assets
              </Button>
              <Button
                onClick={goToMintPage}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Mint
              </Button>
            </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isConnected ? (
              <>
                <Button
                  onClick={handleOpenUserMenu}
                  color="secondary"
                  variant="contained"
                >
                  <Typography>
                    {account!.username.substring(0, 10).toLocaleUpperCase()}
                  </Typography>
                </Button>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      disconnect();
                      goToHomePage()
                    }}
                  >
                    <Typography textAlign="center">Disconnect</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="secondary" variant="contained" onClick={connect}>
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Nav;
