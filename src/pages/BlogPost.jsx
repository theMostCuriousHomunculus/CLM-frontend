import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useHistory, useParams } from 'react-router-dom';
import MUIAvatar from '@material-ui/core/Avatar';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUICardActions from '@material-ui/core/CardActions';
import MUISyncIcon from '@material-ui/icons/Sync';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Comment from '../components/BlogPost Page/Comment';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import NewComment from '../components/BlogPost Page/NewComment';
import theme from '../theme';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

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
      background: '#fff',
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
  avatarLarge: {
    height: '150px',
    width: '150px'
  }
});

const BlogPost = () => {
  const authentication = React.useContext(AuthenticationContext);
  const bodyInput = React.useRef();
  const classes = useStyles();
  const imageInput = React.useRef();
  const subtitleInput = React.useRef();
  const titleInput = React.useRef();
  const [blogPost, setBlogPost] = React.useState({
    _id: undefined,
    author: {
      _id: undefined,
      avatar: undefined,
      name: undefined
    },
    body: undefined,
    comments: [],
    image: undefined,
    subtitle: undefined,
    title: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    __v: undefined
  });
  const { loading, sendRequest } = useRequest();

  const blogPostId = useParams().blogPostId;
  const history = useHistory();

  React.useEffect(() => {
    if (blogPostId !== 'new-post') {
      const fetchBlogPost = async function () {
        try {
          const blogPostData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog/${blogPostId}`, 'GET', null, {});
          setBlogPost(blogPostData);
        } catch (error) {
          console.log(error);
        }
      };
      fetchBlogPost();
    } else {
      const fetchProfileInfo = async function () {
        try {
          const profileData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/${authentication.userId}`, 'GET', null, {});
          setBlogPost((prevState) => ({
            ...prevState,
            author: {
              _id: authentication.userId,
              avatar: profileData.avatar,
              name: profileData.name
            },
            body: '',
            comments: [],
            image: '',
            subtitle: '',
            title: '',
            updatedAt: Date.now()
          }));
        } catch (error) {
          console.log(error);
        }
      };
      fetchProfileInfo();
    }
  }, [authentication.userId, blogPostId, sendRequest]);

  function refreshPage (refreshedArticle) {
    setBlogPost(refreshedArticle);
  }

  async function submitPost () {
    const method = blogPostId === 'new-post' ? 'POST' : 'PATCH';
    const urlSuffix = blogPostId === 'new-post' ? '' : `/blog/${blogPostId}`;
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog${urlSuffix}`,
        method,
        JSON.stringify({
          body: bodyInput.current.value,
          image: imageInput.current.value,
          subtitle: subtitleInput.current.value,
          title: titleInput.current.value
        }),
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      history.push('/blog');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <MUICard>
          <MUICardHeader
            avatar={<MUIAvatar alt={blogPost.author.name} className={classes.avatarLarge} src={blogPost.author.avatar} />}
            disableTypography={true}
            title={blogPost.author._id === authentication.userId ?
              <MUITextField
                defaultValue={blogPost.title}
                fullWidth
                inputRef={titleInput}
                label="Title"
                type="text"
                variant="outlined"
              /> :
              <MUITypography variant="subtitle1">{blogPost.title}</MUITypography>
            }
            subheader={
              <React.Fragment>
                {blogPost.author._id === authentication.userId ?
                  <React.Fragment>
                    <MUITextField
                      defaultValue={blogPost.subtitle}
                      fullWidth
                      inputRef={subtitleInput}
                      label="Subtitle"
                      style={{ marginTop: 16 }}
                      type="text"
                      variant="outlined"
                    />
                    <MUITextField
                      defaultValue={blogPost.image}
                      fullWidth
                      inputRef={imageInput}
                      label="Image"
                      style={{ marginTop: 16 }}
                      type="text"
                      variant="outlined"
                    />
                  </React.Fragment>  :
                  <MUITypography variant="subtitle2">{blogPost.subtitle}</MUITypography>
                }
                <MUITypography
                  color="textSecondary"
                  variant="body2"
                >
                A work of genius by {blogPost.author.name}.
                </MUITypography>
                <MUITypography
                  color="textSecondary"
                  variant="body2"
                >
                Last updated {new Date(blogPost.updatedAt).toLocaleString()}.
                </MUITypography>
              </React.Fragment>
            }
          />
          <MUICardContent>
            {blogPost.author._id === authentication.userId ?
              <MUITextField
                defaultValue={blogPost.body}
                fullWidth
                inputRef={bodyInput}
                label="Body"
                multiline
                rows={20}
                type="text"
                variant="outlined"
              /> :
              <article className={classes.article}>
                <ReactMarkdown escapeHtml={false} source={blogPost.body} />
              </article>
            }
          </MUICardContent>
          <MUICardActions>
            {blogPost.author._id === authentication.userId &&
              <MUIButton
                color="primary"
                onClick={submitPost}
                variant="contained"
              >
                {blogPostId === 'new-post' ? 'Publish' : <MUISyncIcon />}
              </MUIButton>
            }
          </MUICardActions>
        </MUICard>
      }
      {authentication.isLoggedIn && blogPostId !== 'new-post' &&
        <NewComment pushNewComment={refreshPage} />
      }
      {blogPost.comments.map(function (comment) {
        return <Comment comment={comment} key={comment._id} />;
      })}
    </React.Fragment>
  );
}

export default BlogPost;