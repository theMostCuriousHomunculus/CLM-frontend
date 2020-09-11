import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIAvatar from '@material-ui/core/Avatar';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIThumbDownIcon from '@material-ui/icons/ThumbDown';
import MUIThumbUpIcon from '@material-ui/icons/ThumbUp';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  warningButton: {
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

const ExistingComment = (props) => {

  const authentication = React.useContext(AuthenticationContext);
  const blogPostId = useParams().blogPostId;
  const classes = useStyles();
  const { author } = props.comment;
  const { sendRequest } = useRequest();

  async function deleteComment () {
    try {
      const updatedBlogPost = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog/${blogPostId}/${props.comment._id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + authentication.token
        }
      );
      props.deleteComment(updatedBlogPost);
    } catch (err) {
      console.log(err);
    }
  }

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
        {author._id === authentication.userId ?
          <MUIButton
            className={classes.warningButton}
            onClick={deleteComment}
            startIcon={<MUIDeleteForeverIcon />}
            variant="contained"
          >
            Delete
          </MUIButton> :
          <React.Fragment>
            <MUITypography variant="body2">These buttons don't actually do anything yet but feel free to press them anyway!</MUITypography>
            <MUIButton className={classes.warningButton} variant="contained">
              <MUIThumbDownIcon />
            </MUIButton>
            <MUIButton className={classes.likeButton} color="secondary" variant="contained">
              <MUIThumbUpIcon />
            </MUIButton>
          </React.Fragment>
        }
      </MUICardActions>
    </MUICard>
  );
}

export default ExistingComment;