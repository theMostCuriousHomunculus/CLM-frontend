import React from 'react';
import { Link } from 'react-router-dom';
import MUIAvatar from '@material-ui/core/Avatar';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIThumbDownIcon from '@material-ui/icons/ThumbDown';
import MUIThumbUpIcon from '@material-ui/icons/ThumbUp';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';

const useStyles = makeStyles({
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  dislikeButton: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  },
  likeButton: {
    color: theme.palette.primary.main
  }
});

const Comment = (props) => {

  const classes = useStyles();
  const { author } = props.comment;

  return (
    <MUICard>
      <MUICardHeader
        avatar={<MUIAvatar alt={author.name} className={classes.avatarSmall} src={author.avatar}/>}
        disableTypography={true}
        title={<MUITypography color="textPrimary" variant="body1">
          <Link to={`/account/${author._id}`}>{author.name}</Link>
        </MUITypography>}
        subheader={<MUITypography color="textSecondary" variant="body2">Last updated {new Date(props.comment.updatedAt).toLocaleString()}</MUITypography>}
      />
      <MUICardContent>
        <MUITypography variant="body1">{props.comment.body}</MUITypography>
      </MUICardContent>
      <MUICardActions>
        <MUITypography variant="body2">These buttons don't actually do anything yet but feel free to press them anyway!</MUITypography>
        <MUIButton className={classes.dislikeButton} variant="contained">
          <MUIThumbDownIcon />
        </MUIButton>
        <MUIButton className={classes.likeButton} color="secondary" variant="contained">
          <MUIThumbUpIcon />
        </MUIButton>
      </MUICardActions>
    </MUICard>
  );
}

export default Comment;