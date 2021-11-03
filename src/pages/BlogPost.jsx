import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
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
import useRequest from '../hooks/request-hook';
import Avatar from '../components/miscellaneous/Avatar';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/authentication-context';

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
  const authentication = React.useContext(AuthenticationContext);
  const { blogPostID } = useParams();
  const classes = useStyles();
  const newComment = React.useRef();
  const { loading, sendRequest } = useRequest();
  const [viewMode, setViewMode] = React.useState('Live');
  const [blogPost, setBlogPost] = React.useState({
    _id: null,
    author: {
      _id: '',
      avatar: '',
      name: '...'
    },
    body: '',
    comments: [],
    image: '',
    subtitle: '',
    title: '',
    createdAt: null,
    updatedAt: null
  });

  async function submitComment(event) {
    event.preventDefault();
    await sendRequest({
      callback: () => {
        newComment.current.value = '';
        newComment.current.focus();
      },
      headers: {
        BlogPostID: blogPostID
      },
      operation: 'createComment',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(body: "${newComment.current.value}") {
                _id
              }
            }
          `
        };
      }
    });
  }

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <MUICard>
        {blogPost.author._id === authentication.userID ? (
          <form onSubmit={submitBlogPost}>
            <MUICardHeader
              avatar={
                <Avatar
                  alt={blogPost.author.name}
                  size="large"
                  src={blogPost.author.avatar}
                />
              }
              className={classes.cardHeader}
              title={
                <MUITextField
                  fullWidth
                  label="Title"
                  onChange={(event) => {
                    event.persist();
                    setBlogPost((prevState) => ({
                      ...prevState,
                      title: event.target.value
                    }));
                  }}
                  type="text"
                  value={blogPost.title}
                />
              }
              subheader={
                <React.Fragment>
                  <MUITextField
                    fullWidth
                    label="Subtitle"
                    onChange={(event) => {
                      event.persist();
                      setBlogPost((prevState) => ({
                        ...prevState,
                        subtitle: event.target.value
                      }));
                    }}
                    style={{ marginTop: 16 }}
                    type="text"
                    value={blogPost.subtitle}
                  />
                  <MUITextField
                    fullWidth
                    label="Image"
                    onChange={(event) => {
                      event.persist();
                      setBlogPost((prevState) => ({
                        ...prevState,
                        image: event.target.value
                      }));
                    }}
                    style={{ marginTop: 16 }}
                    type="text"
                    value={blogPost.image}
                  />
                  <MUITypography color="textSecondary" variant="body2">
                    A work of genius by {blogPost.author.name}.
                  </MUITypography>
                  {blogPost.updatedAt && (
                    <MUITypography color="textSecondary" variant="body2">
                      Last updated{' '}
                      {new Date(parseInt(blogPost.updatedAt)).toLocaleString()}.
                    </MUITypography>
                  )}
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
                    setBlogPost((prevState) => ({
                      ...prevState,
                      body: event.target.value
                    }));
                  }}
                  rows={20}
                  type="text"
                  value={blogPost.body}
                />
              ) : (
                <article className={classes.article}>
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {blogPost.body}
                  </ReactMarkdown>
                </article>
              )}
            </MUICardContent>
            <MUICardActions>
              <MUIButton type="submit">
                {blogPostID === 'new-post' ? 'Publish' : <MUISyncIcon />}
              </MUIButton>
            </MUICardActions>
          </form>
        ) : (
          <React.Fragment>
            <MUICardHeader
              avatar={
                <Avatar
                  alt={blogPost.author.name}
                  size="large"
                  src={blogPost.author.avatar}
                />
              }
              className={classes.cardHeader}
              title={blogPost.title}
              subheader={blogPost.subtitle}
            />
            <MUICardContent>
              <article className={classes.article}>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {blogPost.body}
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
            {blogPost.comments
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
          {authentication.isLoggedIn && (
            <MUICardActions>
              <form className={classes.commentForm} onSubmit={submitComment}>
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  inputRef={newComment}
                  multiline
                  rows={2}
                  type="text"
                />
                <MUIButton type="submit">Preach!</MUIButton>
              </form>
            </MUICardActions>
          )}
        </MUICard>
      )}
    </React.Fragment>
  );
}
