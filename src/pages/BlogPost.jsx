import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useHistory, useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUICardActions from '@material-ui/core/CardActions';
import MUISyncIcon from '@material-ui/icons/Sync';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { createClient } from 'graphql-ws';
import { makeStyles } from '@material-ui/core/styles';

import theme, { backgroundColor } from '../theme';
import useRequest from '../hooks/request-hook';
import LargeAvatar from '../components/miscellaneous/LargeAvatar';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import SmallAvatar from '../components/miscellaneous/SmallAvatar';
import { AuthenticationContext } from '../contexts/authentication-context';

const desiredBlogPostInfo = `_id\nauthor {\n_id\navatar\nname\n}\nbody\ncomments {\n_id\nauthor {\n_id\navatar\nname\n}\nbody\nupdatedAt\n}\nimage\nsubtitle\ntitle\ncreatedAt\nupdatedAt`;

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
  cardHeader: {
    '& .MuiCardHeader-action': {
      alignSelf: 'flex-end',
      margin: '0 0 0 16px'
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

export default function BlogPost () {

  const authentication = React.useContext(AuthenticationContext);
  const blogPostID = useParams().blogPostId;
  const classes = useStyles();
  const history = useHistory();
  const newComment = React.useRef();
  const { loading, sendRequest } = useRequest();
  const [viewMode, setViewMode] = React.useState('Live');
  const [blogPost, setBlogPost] = React.useState({
    _id: null,
    author: {
      _id: null,
      avatar: null,
      name: null
    },
    body: '',
    comments: [],
    image: '',
    subtitle: '',
    title: '',
    createdAt: null,
    updatedAt: null
  });

  React.useEffect(() => {

    async function initialize () {
      if (blogPostID !== 'new-post') {
        
        await sendRequest({
          callback: (data) => {
            setBlogPost(data);
          },
          headers: { BlogPostID: blogPostID },
          load: true,
          operation: 'fetchBlogPostByID',
          get body() {
            return {
              query: `
                query {
                  ${this.operation} {
                    ${desiredBlogPostInfo}
                  }
                }
              `
            }
          }
        });
  
      } else if (!authentication.isAdmin) {
        // user is not an admin but trying to create a new blog post
        history.push('/blog');
      } else {
        
        setViewMode('Edit');

        await sendRequest({
          callback: (data) => {
            setBlogPost(prevState => ({
              ...prevState,
              author: {
                ...data
              }
            }));
          },
          load: true,
          operation: 'fetchAccountByID',
          get body() {
            return {
              query: `
                query {
                  ${this.operation}(_id: "${authentication.userId}") {
                    _id
                    avatar
                    name
                  }
                }
              `
            }
          }
        });
  
      }
    }

    initialize();

    if (blogPostID !== 'new-post') {
      const client = createClient({
        connectionParams: {
          authToken: authentication.token,
          blogPostID
        },
        url: process.env.REACT_APP_GRAPHQL_WS_URL
      });
  
      async function subscribe () {
        function onNext(update) {
          setBlogPost(update.data.subscribeBlogPost);
        }
  
        await new Promise((resolve, reject) => {
          client.subscribe({
            query: `subscription {
              subscribeBlogPost {
                ${desiredBlogPostInfo}
              }
            }`
          },
          {
            complete: resolve,
            error: reject,
            next: onNext
          });
        });
      }
  
      subscribe(result => console.log(result), error => console.log(error));
  
      return client.dispose;
    }
    
  }, [authentication.isAdmin, authentication.token, authentication.userId, blogPostID, history, sendRequest]);

  async function submitBlogPost () {
    const headers = {};
    let operation;

    if (blogPostID === 'new-post') {
      operation = 'createBlogPost';
    } else {
      headers.BlogPostID = blogPostID;
      operation = 'editBlogPost';
    }

    await sendRequest({
      callback: () => {
        history.push('/blog');
      },
      headers,
      operation,
      body: {
        query: `
          mutation {
            ${operation}(
              input: {
                body: "${blogPost.body}",
                image: "${blogPost.image}",
                subtitle: "${blogPost.subtitle}"
                title: "${blogPost.title}"
              }
            ) {
              _id
            }
          }
        `
      }
    });
  }

  async function submitComment (event) {
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
        }
      }
    });
  }

  return (
    loading ?
      <LoadingSpinner /> :
      <React.Fragment>
        <MUICard>
          {blogPost.author._id === authentication.userId ?
            <form onSubmit={submitBlogPost}>
              <MUICardHeader
                avatar={<LargeAvatar alt={blogPost.author.name} src={blogPost.author.avatar} />}
                className={classes.cardHeader}
                disableTypography={true}
                title={
                  <MUITextField
                    fullWidth
                    label="Title"
                    margin="dense"
                    onChange={event => {
                      event.persist();
                      setBlogPost(prevState => ({
                        ...prevState,
                        title: event.target.value
                      }));
                    }}
                    type="text"
                    value={blogPost.title}
                    variant="outlined"
                  />
                }
                subheader={
                  <React.Fragment>
                    <MUITextField
                      fullWidth
                      label="Subtitle"
                      margin="dense"
                      onChange={event => {
                        event.persist();
                        setBlogPost(prevState => ({
                          ...prevState,
                          subtitle: event.target.value
                        }));
                      }}
                      style={{ marginTop: 16 }}
                      type="text"
                      value={blogPost.subtitle}
                      variant="outlined"
                    />
                    <MUITextField
                      fullWidth
                      label="Image"
                      margin="dense"
                      onChange={event => {
                        event.persist();
                        setBlogPost(prevState => ({
                          ...prevState,
                          image: event.target.value
                        }));
                      }}
                      style={{ marginTop: 16 }}
                      type="text"
                      value={blogPost.image}
                      variant="outlined"
                    />
                    <MUITypography color="textSecondary" variant="body2">
                      A work of genius by {blogPost.author.name}.
                    </MUITypography>
                    {blogPost.updatedAt &&
                      <MUITypography color="textSecondary" variant="body2">
                        Last updated {new Date(parseInt(blogPost.updatedAt)).toLocaleString()}.
                      </MUITypography>
                    }
                  </React.Fragment>
                }
                action={
                  <MUIButton
                    color="secondary"
                    onClick={() => setViewMode(currentViewMode => currentViewMode === 'Edit' ? 'Live' : 'Edit')}
                    size="small"
                    variant="contained"
                  >
                    {viewMode === 'Edit' ? 'Switch to Live View' : 'Switch to Edit View'}
                  </MUIButton>
                }
              />
              <MUICardContent>
                {viewMode === 'Edit' ?
                  <MUITextField
                    fullWidth
                    label="Body"
                    margin="dense"
                    multiline
                    onChange={event => {
                      event.persist();
                      setBlogPost(prevState => ({
                        ...prevState,
                        body: event.target.value
                      }));
                    }}
                    rows={20}
                    type="text"
                    value={blogPost.body}
                    variant="outlined"
                  /> :
                  <article className={classes.article}>
                    <ReactMarkdown escapeHtml={false} source={blogPost.body} />
                  </article>
                }
              </MUICardContent>
              <MUICardActions>
                <MUIButton
                  color="primary"
                  type="submit"
                  size="small"
                  variant="contained"
                >
                  {blogPostID === 'new-post' ? 'Publish' : <MUISyncIcon />}
                </MUIButton>
              </MUICardActions>
            </form> :
            <React.Fragment>
              <MUICardHeader
                avatar={<LargeAvatar alt={blogPost.author.name} src={blogPost.author.avatar} />}
                className={classes.cardHeader}
                disableTypography={true}
                title={<MUITypography variant="subtitle1">{blogPost.title}</MUITypography>}
                subheader={<MUITypography variant="subtitle2">{blogPost.subtitle}</MUITypography>}
              />
              <MUICardContent>
                <article className={classes.article}>
                  <ReactMarkdown escapeHtml={false} source={blogPost.body} />
                </article>
              </MUICardContent>
            </React.Fragment>
          }
        </MUICard>

        <MUICard className={classes.commentCard}>
          <MUICardHeader
            disableTypography={true}
            title={<MUITypography variant="subtitle1">Community Reaction</MUITypography>}
          />
          <MUICardContent className={classes.commentSection}>
            {blogPost.comments.map((comment, index, array) => array[array.length - 1 - index]).map(comment => {
              return (
                <div key={comment._id} style={{ display: 'flex', margin: '4px 0' }}>
                  <SmallAvatar alt={comment.author.name} src={comment.author.avatar} />
                  <MUITypography variant="body2">{comment.body}</MUITypography>
                </div>
              );
            })}
          </MUICardContent>
          {authentication.isLoggedIn && blogPostID !== 'new-post' &&
            <MUICardActions>
              <form className={classes.commentForm} onSubmit={submitComment}>
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  inputRef={newComment}
                  margin="dense"
                  multiline
                  rows={2}
                  type="text"
                  variant="outlined"
                />
                <MUIButton color="primary" fullWidth={false} size="small" type="submit" variant="contained">
                  Preach!
                </MUIButton>
              </form>
            </MUICardActions>
          }
        </MUICard>
      </React.Fragment>
  );
};