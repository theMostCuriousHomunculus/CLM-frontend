import React from 'react';
import { useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';

import { AuthenticationContext } from '../../contexts/authentication-context';
import { useRequest } from '../../hooks/request-hook';

const NewComment = (props) => {
  const authentication = React.useContext(AuthenticationContext);
  const bodyInput = React.useRef();
  const { sendRequest } = useRequest();

  const blogPostId = useParams().blogPostId;

  async function submitComment () {
    try {
      const refreshedArticle = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog/${blogPostId}`,
        'POST',
        JSON.stringify({
          body: bodyInput.current.value
        }),
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
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
}

export default NewComment;