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

import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
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
  const subtitleInput = React.useRef();
  const titleInput = React.useRef();
  const [blogPost, setBlogPost] = React.useState(undefined);
  const { loading, sendRequest } = useRequest();

  const blogPostId = useParams().blogPostId;
  const history = useHistory();

  React.useEffect(() => {
    const fetchBlogPost = async function () {
      try {
        const blogPostData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog/${blogPostId}`, 'GET', null, {});
        console.log(blogPostData);
        setBlogPost(blogPostData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlogPost();
  }, [blogPostId, sendRequest]);

  async function submitChanges () {
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog/${blogPostId}`,
        'PATCH',
        JSON.stringify({
          body: bodyInput.current.value,
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
        <React.Fragment>
          {blogPost &&
            <MUICard>
              <MUICardHeader
                avatar={<MUIAvatar alt={blogPost.author.name} className={classes.avatarLarge} src={blogPost.author.avatar} />}
                disableTypography={true}
                title={blogPost.author._id === authentication.userId ?
                  <MUITextField
                    defaultValue={blogPost.article.title}
                    fullWidth
                    inputRef={titleInput}
                    label="Title"
                    type="text"
                    variant="outlined"
                  /> :
                  <MUITypography variant="subtitle1">{blogPost.article.title}</MUITypography>
                }
                subheader={
                  <React.Fragment>
                    <React.Fragment>
                      {blogPost.author._id === authentication.userId ?
                        <MUITextField
                          defaultValue={blogPost.article.subtitle}
                          fullWidth
                          inputRef={subtitleInput}
                          label="Subtitle"
                          style={{ marginTop: 16 }}
                          type="text"
                          variant="outlined"
                        /> :
                        <MUITypography variant="subtitle2">{blogPost.article.subtitle}</MUITypography>
                      }
                    </React.Fragment>
                    <MUITypography color="textSecondary" variant="body2">A work of genius by {blogPost.author.name}.</MUITypography>
                    <MUITypography color="textSecondary" variant="body2">Last updated {Date(blogPost.article.updatedAt).toLocaleString()}.</MUITypography>
                  </React.Fragment>
                }
              />
              <MUICardContent>
                {blogPost.author._id === authentication.userId ?
                  <MUITextField
                    defaultValue={blogPost.article.body}
                    fullWidth
                    inputRef={bodyInput}
                    label="Body"
                    multiline
                    rows={20}
                    type="text"
                    variant="outlined"
                  /> :
                  <article className={classes.article}>
                    <ReactMarkdown escapeHtml={false} source={blogPost.article.body} />
                  </article>
                }
              </MUICardContent>
              <MUICardActions>
                {blogPost.author._id === authentication.userId &&
                  <MUIButton
                    color="primary"
                    onClick={submitChanges}
                    variant="contained"
                  >
                    <MUISyncIcon />
                  </MUIButton>
                }
              </MUICardActions>
            </MUICard>
          }
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default BlogPost;