/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Slide from '@mui/material/Slide';
import { Link } from 'react-router-dom';
import image from '../assets/Logo.png';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Sign Up', path: '/register' },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} style={{height: "auto",paddingLeft: "0px",
    paddingRight: "0px"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <picture>
              <source media="(min-width: 699px)" srcSet={image} />
              <source media="(max-width: 698px)" srcSet={image} />
              <img src={image} alt="Logo" width="50" height="40" style={{top: "5px",}} />
            </picture>
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={null} // anchor null
              anchorReference="anchorPosition"
              anchorPosition={{ top: 0, left: 0 }} // always screen top-left se open
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              onClick={(props) => <Slide {...props} direction="down" />}
              PaperProps={{
                sx: {
                  mt: "35px",               // Top me AppBar ke neeche space (AppBar height jitna)
                  width: "100%",
                  // height: "calc(50vh - 64px)", // full height minus AppBar
                  background: "#0D1636",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    my: 2,
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;