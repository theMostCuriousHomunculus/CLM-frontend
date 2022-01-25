import React from 'react';
import MUIBox from '@mui/material/Box';
import MUIFirstPageIcon from '@mui/icons-material/FirstPage';
import MUIIconButton from '@mui/material/IconButton';
import MUIKeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import MUIKeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import MUILastPageIcon from '@mui/icons-material/LastPage';

import theme from '../../theme';

export default function TablePaginationActions({
  count,
  page,
  rowsPerPage,
  onPageChange
}) {
  return (
    <MUIBox sx={{ flexShrink: 0, ml: 3 }}>
      <MUIIconButton
        aria-label="first page"
        color="secondary"
        disabled={page === 0}
        onClick={(event) => {
          onPageChange(event, 0);
        }}
      >
        {theme.direction === 'rtl' ? <MUILastPageIcon /> : <MUIFirstPageIcon />}
      </MUIIconButton>
      <MUIIconButton
        aria-label="previous page"
        color="secondary"
        disabled={page === 0}
        onClick={(event) => {
          onPageChange(event, page - 1);
        }}
      >
        {theme.direction === 'rtl' ? (
          <MUIKeyboardArrowRight />
        ) : (
          <MUIKeyboardArrowLeft />
        )}
      </MUIIconButton>
      <MUIIconButton
        aria-label="next page"
        color="secondary"
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        onClick={(event) => {
          onPageChange(event, page + 1);
        }}
      >
        {theme.direction === 'rtl' ? (
          <MUIKeyboardArrowLeft />
        ) : (
          <MUIKeyboardArrowRight />
        )}
      </MUIIconButton>
      <MUIIconButton
        aria-label="last page"
        color="secondary"
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        onClick={(event) => {
          onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        }}
      >
        {theme.direction === 'rtl' ? <MUIFirstPageIcon /> : <MUILastPageIcon />}
      </MUIIconButton>
    </MUIBox>
  );
}
