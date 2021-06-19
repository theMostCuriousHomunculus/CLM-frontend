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
import { makeStyles } from '@material-ui/core/styles';

import ExistingComment from '../components/BlogPost Page/ExistingComment';
import LargeAvatar from '../components/miscellaneous/LargeAvatar';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import NewComment from '../components/BlogPost Page/NewComment';
import theme, { backgroundColor } from '../theme';
import { AuthenticationContext } from '../contexts/authentication-context';
import { fetchAccountById } from '../requests/REST/account-requests';
import { editBlogPost, fetchBlogPostById, publish } from '../requests/REST/blog-requests';

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
  }
});

function BlogPost () {
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('Live');
  const [blogPostState, setBlogPostState] = React.useState({
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
    updatedAt: null,
    __v: null
  });

  const blogPostId = useParams().blogPostId;
  const history = useHistory();

  const initializeBlogPost = React.useCallback(async function () {
    if (blogPostId !== 'new-post') {
      try {
        setLoading(true);
        const blogPostData = await fetchBlogPostById(blogPostId);
        setBlogPostState(blogPostData);

        if (blogPostData.author._id === authentication.userId) {
          setViewMode('Edit');
        }

      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const profileData = await fetchAccountById(authentication.userId);
        setBlogPostState((prevState) => ({
          ...prevState,
          author: {
            _id: authentication.userId,
            avatar: profileData.user.avatar,
            name: profileData.user.name
          }
        }));
        setViewMode('Edit');
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }, [authentication.userId, blogPostId]);

  React.useEffect(() => {
    initializeBlogPost();
  }, [initializeBlogPost]);

  function refreshPage (refreshedArticle) {
    setBlogPostState(refreshedArticle);
  }

  async function submitPost () {
    const details = {
      body: blogPostState.body,
      image: blogPostState.image,
      subtitle: blogPostState.subtitle,
      title: blogPostState.title
    };

    try {
      if (blogPostId === 'new-post') {
        await publish(details, authentication.token);
      } else {
        await editBlogPost(details, blogPostId, authentication.token);
      }
      history.push('/blog');
    } catch (error) {
      console.log(error.message);
    }
  }

  function toggleViewMode () {
    setViewMode((currentViewMode) => {
      return currentViewMode === 'Edit' ? 'Live' : 'Edit';
    });
  }

  return (loading ?
    <LoadingSpinner /> :
    <React.Fragment>
      <MUICard>
        <MUICardHeader
          avatar={<LargeAvatar alt={blogPostState.author.name} src={blogPostState.author.avatar} />}
          className={classes.cardHeader}
          disableTypography={true}
          title={blogPostState.author._id === authentication.userId ?
            <MUITextField
              defaultValue={blogPostState.title}
              fullWidth
              label="Title"
              margin="dense"
              onChange={(event) => {
                event.persist();
                setBlogPostState((prevState) => {
                  return {
                    ...prevState,
                    title: event.target.value
                  }
                });
              }}
              type="text"
              value={blogPostState.title}
              variant="outlined"
            /> :
            <MUITypography variant="subtitle1">{blogPostState.title}</MUITypography>
          }
          subheader={
            <React.Fragment>
              {blogPostState.author._id === authentication.userId ?
                <React.Fragment>
                  <MUITextField
                    defaultValue={blogPostState.subtitle}
                    fullWidth
                    label="Subtitle"
                    margin="dense"
                    onChange={(event) => {
                      event.persist();
                      setBlogPostState((prevState) => {
                        return {
                          ...prevState,
                          subtitle: event.target.value
                        }
                      });
                    }}
                    style={{ marginTop: 16 }}
                    type="text"
                    value={blogPostState.subtitle}
                    variant="outlined"
                  />
                  <MUITextField
                    defaultValue={blogPostState.image}
                    fullWidth
                    label="Image"
                    margin="dense"
                    onChange={(event) => {
                      event.persist();
                      setBlogPostState((prevState) => {
                        return {
                          ...prevState,
                          image: event.target.value
                        }
                      });
                    }}
                    style={{ marginTop: 16 }}
                    type="text"
                    value={blogPostState.image}
                    variant="outlined"
                  />
                </React.Fragment>  :
                <MUITypography variant="subtitle2">{blogPostState.subtitle}</MUITypography>
              }
              <MUITypography
                color="textSecondary"
                variant="body2"
              >
                A work of genius by {blogPostState.author.name}.
              </MUITypography>
              {blogPostState.updatedAt &&
                <MUITypography
                  color="textSecondary"
                  variant="body2"
                >
                  Last updated {new Date(blogPostState.updatedAt).toLocaleString()}.
                </MUITypography>
              }
            </React.Fragment>
          }
          action={blogPostState.author._id === authentication.userId &&
            <MUIButton
              color="secondary"
              onClick={toggleViewMode}
              size="small"
              variant="contained"
            >
              {viewMode === 'Edit' ? 'Switch to Live View' : 'Switch to Edit View'}
            </MUIButton>}
        />
        <MUICardContent>
          {blogPostState.author._id === authentication.userId &&
            viewMode === 'Edit' ?
            <MUITextField
              fullWidth
              label="Body"
              margin="dense"
              multiline
              onChange={(event) => {
                event.persist();
                setBlogPostState((prevState) => {
                  return {
                    ...prevState,
                    body: event.target.value
                  }
                });
              }}
              rows={20}
              type="text"
              value={blogPostState.body}
              variant="outlined"
            /> :
            <article className={classes.article}>
              <ReactMarkdown escapeHtml={false} source={blogPostState.body} />
            </article>
          }
        </MUICardContent>
        {blogPostState.author._id === authentication.userId &&
          <MUICardActions>
            <MUIButton
              color="primary"
              onClick={submitPost}
              size="small"
              variant="contained"
            >
              {blogPostId === 'new-post' ? 'Publish' : <MUISyncIcon />}
            </MUIButton>
          </MUICardActions>
        }
      </MUICard>

      {authentication.isLoggedIn && blogPostId !== 'new-post' &&
        <NewComment pushNewComment={refreshPage} />
      }

      {blogPostState.comments.map(function (comment) {
        return <ExistingComment comment={comment} key={comment._id} deleteComment={refreshPage} />;
      })}
    </React.Fragment>
  );
}

export default BlogPost;