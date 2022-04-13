import React, { useContext } from 'react';
import MUIButton from '@mui/material/Button';
import MUIDownloadIcon from '@mui/icons-material/Download';
import MUIDrawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';

import NavigationLinks from './NavigationLinks';
import SiteSearchBar from './SiteSearchBar';
import theme from '../../theme';
import { PermissionsContext } from '../../contexts/Permissions';

export default function NavigationDrawer({ navigationDrawerOpen, setNavigationDrawerOpen }) {
  const { deferredPrompt, setDeferredPrompt } = useContext(PermissionsContext);
  const searchBarLocation = useMediaQuery(theme.breakpoints.up('md')) ? 'top' : 'side';

  function toggleDrawer(event) {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setNavigationDrawerOpen((prevState) => !prevState);
  }

  return (
    <MUIDrawer
      anchor="left"
      id="side-navigation"
      onClose={() => setNavigationDrawerOpen(false)}
      open={navigationDrawerOpen}
    >
      {searchBarLocation === 'side' && (
        <SiteSearchBar setNavigationDrawerOpen={setNavigationDrawerOpen} color="secondary" />
      )}
      <NavigationLinks toggleDrawer={toggleDrawer} />
      {deferredPrompt && (
        <MUIButton
          fullWidth
          onClick={async () => {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            setNavigationDrawerOpen(false);
          }}
          startIcon={<MUIDownloadIcon />}
        >
          Install the App!
        </MUIButton>
      )}
    </MUIDrawer>
  );
}
