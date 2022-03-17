import React, { useState } from 'react';
import MUIIconButton from '@mui/material/IconButton';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';
import MUIMoreVertIcon from '@mui/icons-material/MoreVert';

export default function MoveCardMenu(options, moveIDPrefix) {
  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <MUIIconButton
        aria-label="move-card"
        id={`${moveIDPrefix}move-button`}
        aria-controls={open ? `${moveIDPrefix}move-menu` : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MUIMoreVertIcon />
      </MUIIconButton>
      <MUIMenu
        id={`${moveIDPrefix}move-menu`}
        MenuListProps={{
          'aria-labelledby': `${moveIDPrefix}move-button`
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            maxHeight: 100,
            width: '20ch'
          }
        }}
      >
        {Array.isArray(options) &&
          options.map((option) => (
            <MUIMenuItem
              key={option.text}
              onClick={() => {
                option.action();
                setAnchorEl(null);
              }}
            >
              {option.text}
            </MUIMenuItem>
          ))}
      </MUIMenu>
    </React.Fragment>
  );
}
