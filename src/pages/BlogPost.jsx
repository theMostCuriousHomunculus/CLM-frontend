import React from 'react';
import ReactMarkdown from 'react-markdown';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUICardActions from '@mui/material/CardActions';
import MUISyncIcon from '@mui/icons-material/Sync';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import rehypeRaw from 'rehype-raw';
import { makeStyles } from '@mui/styles';

import theme, { backgroundColor } from '../theme';
import Avatar from '../components/miscellaneous/Avatar';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/Authentication';
import { BlogPostContext } from '../contexts/blog-post-context';

const useStyles = makeStyles({
  article: {
    fontFamily: 'Roboto, Arial, sans-serif',
    '& blockquote': {
      clear: 'both',
      display: 'block',
      fontFamily: 'Roboto',
      fontStyle: 'italic',
      borderWidth: '2px 0',
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.main,
      padding: '20px 5%',
      margin: '20px 0',
      position: 'relative',
      textAlign: 'center'
    },
    '& blockquote:before': {
      content: '"\\201C"',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%, -65%)',
      background: backgroundColor,
      width: 48,
      height: 32,
      fontFamily: 'sans-serif',
      fontSize: '5rem',
      color: theme.palette.primary.main,
      textAlign: 'center'
    },
    '& blockquote:after': {
      content: '"\\2013 \\2003" attr(cite)',
      display: 'block',
      textAlign: 'right',
      fontSize: '0.875em',
      fontStyle: 'normal',
      color: theme.palette.primary.main
    },
    '& figure': {
      display: 'flex',
      flexDirection: 'column'
    },
    '& figcaption': {
      fontStyle: 'italic',
      fontWeight: 'lighter',
      margin: 'auto',
      textAlign: 'center',
      width: 215
    },
    '& h1, h2, h3, h4, h5, h6': {
      textAlign: 'center'
    },
    '& li': {
      listStylePosition: 'inside',
      textIndent: 24
    },
    '& > p': {
      textAlign: 'justify',
      textIndent: 24
    }
  },
  commentCard: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 16px)'
  },
  commentForm: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  commentSection: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flexGrow: 1,
    overflowY: 'auto'
  }
});

export default function BlogPost() {
  const { isLoggedIn, userID } = React.useContext(AuthenticationContext);
  const {
    loading,
    blogPostState: {
      _id: blogPostID,
      author,
      body,
      comments,
      createdAt,
      image,
      subtitle,
      title,
      updatedAt
    },
    createBlogPost,
    createComment,
    editBlogPost,
    setBlogPostState,
    setViewMode,
    viewMode
  } = React.useContext(BlogPostContext);
  const classes = useStyles();
  const newComment = React.useRef();

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <MUICard>
        {author._id === userID ? (
          <React.Fragment>
            <MUICardHeader
              avatar={
                <Avatar alt={author.name} size="medium" src={author.avatar} />
              }
              className={classes.cardHeader}
              title={
                <MUITextField
                  fullWidth
                  label="Title"
                  onChange={(event) => {
                    event.persist();
                    setBlogPostState((prevState) => ({
                      ...prevState,
                      title: event.target.value
                    }));
                  }}
                  type="text"
                  value={title}
                />
              }
              subheader={
                <React.Fragment>
                  <MUITextField
                    fullWidth
                    label="Subtitle"
                    onChange={(event) => {
                      event.persist();
                      setBlogPostState((prevState) => ({
                        ...prevState,
                        subtitle: event.target.value
                      }));
                    }}
                    style={{ marginTop: 16 }}
                    type="text"
                    value={subtitle}
                  />
                  <MUITextField
                    fullWidth
                    label="Image"
                    onChange={(event) => {
                      event.persist();
                      setBlogPostState((prevState) => ({
                        ...prevState,
                        image: event.target.value
                      }));
                    }}
                    style={{ marginTop: 16 }}
                    type="text"
                    value={image}
                  />
                  <MUITypography color="textSecondary" variant="body2">
                    A work of genius by {author.name}.
                  </MUITypography>
                  <MUITypography color="textSecondary" variant="body2">
                    {`Last updated ${new Date(
                      parseInt(updatedAt)
                    ).toLocaleString()}.`}
                  </MUITypography>
                </React.Fragment>
              }
              action={
                <MUIButton
                  color="secondary"
                  onClick={() =>
                    setViewMode((currentViewMode) =>
                      currentViewMode === 'Edit' ? 'Live' : 'Edit'
                    )
                  }
                >
                  {viewMode === 'Edit'
                    ? 'Switch to Live View'
                    : 'Switch to Edit View'}
                </MUIButton>
              }
            />
            <MUICardContent>
              {viewMode === 'Edit' ? (
                <MUITextField
                  fullWidth
                  label="Body"
                  multiline
                  onChange={(event) => {
                    event.persist();
                    setBlogPostState((prevState) => ({
                      ...prevState,
                      body: event.target.value
                    }));
                  }}
                  rows={20}
                  type="text"
                  value={body}
                />
              ) : (
                <article className={classes.article}>
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {body}
                  </ReactMarkdown>
                </article>
              )}
            </MUICardContent>
            <MUICardActions>
              {blogPostID === 'new-post' ? (
                <MUIButton onClick={createBlogPost}>Publish</MUIButton>
              ) : (
                <MUIButton onClick={editBlogPost}>
                  <MUISyncIcon />
                </MUIButton>
              )}
            </MUICardActions>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MUICardHeader
              avatar={
                <Avatar alt={author.name} size="medium" src={author.avatar} />
              }
              className={classes.cardHeader}
              title={title}
              subheader={subtitle}
            />
            <MUICardContent>
              <article className={classes.article}>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {body}
                </ReactMarkdown>
              </article>
            </MUICardContent>
          </React.Fragment>
        )}
      </MUICard>

      {blogPostID !== 'new-post' && (
        <MUICard className={classes.commentCard}>
          <MUICardHeader title="Community Reaction" />
          <MUICardContent className={classes.commentSection}>
            {comments
              .map((comment, index, array) => array[array.length - 1 - index])
              .map((comment) => (
                <div
                  key={comment._id}
                  style={{ display: 'flex', margin: '4px 0' }}
                >
                  <Avatar
                    alt={comment.author.name}
                    size="small"
                    src={comment.author.avatar}
                  />
                  <MUITypography variant="body2">{comment.body}</MUITypography>
                </div>
              ))}
          </MUICardContent>
          {isLoggedIn && (
            <MUICardActions className={classes.commentForm}>
              <MUITextField
                autoComplete="off"
                fullWidth
                inputRef={newComment}
                multiline
                rows={2}
                type="text"
              />
              <MUIButton onClick={() => createComment(newComment)}>
                Preach!
              </MUIButton>
            </MUICardActions>
          )}
        </MUICard>
      )}
    </React.Fragment>
  );
}
