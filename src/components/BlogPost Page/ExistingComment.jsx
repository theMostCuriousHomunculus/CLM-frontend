import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIThumbDownIcon from '@material-ui/icons/ThumbDown';
import MUIThumbUpIcon from '@material-ui/icons/ThumbUp';
import MUITypography from '@material-ui/core/Typography';

import SmallAvatar from '../miscellaneous/SmallAvatar';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import useRequest from '../../hooks/request-hook';

export default function ExistingComment ({
  comment: {
    _id : commentID,
    author: {
      _id: authorID,
      avatar,
      name
    },
    body,
    updatedAt
  },
  deleteComment
}) {

  const { userId } = React.useContext(AuthenticationContext);
  const blogPostId = useParams().blogPostId;
  const { sendRequest } = useRequest();

  async function handleDeleteComment () {
    try {
      const updatedBlogPost = await sendRequest({
        url: `${process.env.REACT_APP_REST_URL}/blog/${blogPostId}/${commentID}`,
        method: 'DELETE'
      });
      deleteComment(updatedBlogPost);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <MUICard>
      <MUICardHeader
        avatar={<SmallAvatar alt={name} src={avatar}/>}
        disableTypography={true}
        title={<MUITypography color="textPrimary" variant="body1">
          <Link to={`/account/${authorID}`}>{name}</Link>
        </MUITypography>}
        subheader={<MUITypography color="textSecondary" variant="body2">Last updated {new Date(updatedAt).toLocaleString()}</MUITypography>}
      />
      <MUICardContent>
        <MUITypography variant="body1">{body}</MUITypography>
      </MUICardContent>
      <MUICardActions>
        {authorID === userId ?
          <WarningButton
            onClick={handleDeleteComment}
            startIcon={<MUIDeleteForeverIcon />}
          >
            Delete
          </WarningButton> :
          <React.Fragment>
            <MUITypography variant="body2">These buttons don't actually do anything yet but feel free to press them anyway!</MUITypography>
            <WarningButton startIcon={<MUIThumbDownIcon />}>
              
            </WarningButton>
            <MUIButton color="primary" size="small" startIcon={<MUIThumbUpIcon />} variant="contained">

            </MUIButton>
          </React.Fragment>
        }
      </MUICardActions>
    </MUICard>
  );
};