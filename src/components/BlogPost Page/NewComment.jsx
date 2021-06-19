import React from 'react';
import { useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';

import useRequest from '../../hooks/request-hook';

export default function NewComment (props) {

  const bodyInput = React.useRef();
  const { sendRequest } = useRequest();

  const blogPostId = useParams().blogPostId;

  async function submitComment () {
    try {
      const refreshedArticle = await sendRequest({
        url: `${process.env.REACT_APP_REST_URL}/blog/${blogPostId}`,
        body: JSON.stringify({
          body: bodyInput.current.value
        })
      });
      bodyInput.current.value = '';
      props.pushNewComment(refreshedArticle);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <MUICard>
      <MUICardHeader
        disableTypography={true}
        title={<MUITypography variant="body1">Leave a Comment!</MUITypography>}
      />
      <MUICardContent style={{ paddingBottom: 0, paddingTop: 0 }}>
        <MUITextField
          autoComplete="off"
          fullWidth
          inputRef={bodyInput}
          margin="dense"
          multiline
          rows={3}
          type="text"
          variant="outlined"
        />
      </MUICardContent>
      <MUICardActions>
        <MUIButton color="primary" onClick={submitComment} size="small" variant="contained">Preach!</MUIButton>
      </MUICardActions>
    </MUICard>
  );
};