import React, { useContext, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUICardActions from '@mui/material/CardActions';
import MUICheckbox from '@mui/material/Checkbox';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIEditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIHelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MUIPostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import MUIPublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import MUISaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import MUITextField from '@mui/material/TextField';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import MUIVisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import rehypeRaw from 'rehype-raw';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from '@mui/styles';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AutoScrollMessages from '../components/miscellaneous/AutoScrollMessages';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import createBlogPost from '../graphql/mutations/blog/create-blog-post';
import createComment from '../graphql/mutations/blog/create-comment';
import editBlogPost from '../graphql/mutations/blog/edit-blog-post';
import theme, { backgroundColor } from '../theme';
import { AuthenticationContext } from '../contexts/Authentication';
import { BlogPostContext } from '../contexts/blog-post-context';
import { ErrorContext } from '../contexts/Error';

const useStyles = makeStyles({
  article: {
    fontFamily: 'Roboto, Arial, sans-serif',
    marginTop: 16,
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
  }
});

export default function BlogPost() {
  const { userID } = useContext(AuthenticationContext);
  const {
    blogPostState: { author, body, comments, image, published, subtitle, title, updatedAt },
    setBlogPostState
  } = useContext(BlogPostContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const blogPostImageWidth = useMediaQuery(theme.breakpoints.up('md')) ? 150 : 75;
  const navigate = useNavigate();
  const { blogPostID } = useParams();
  const [editing, setEditing] = useState(blogPostID === 'new-post');
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { article } = useStyles();

  return (
    <React.Fragment>
      <MUICard>
        <MUICardHeader
          avatar={
            image && (
              <img
                alt="cool magic card art"
                src={image}
                style={{ borderRadius: 4 }}
                width={blogPostImageWidth}
              />
            )
          }
          title={
            author._id === userID && editing ? (
              <React.Fragment>
                <MUITextField
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
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <MUIFormControlLabel
                    control={
                      <MUICheckbox
                        checked={published}
                        onChange={() => {
                          setBlogPostState((prevState) => ({
                            ...prevState,
                            published: !prevState.published
                          }));
                        }}
                      />
                    }
                    label="Published"
                    style={{ marginRight: 8 }}
                  />
                  <MUITooltip title="A published blog post is visible to other users.">
                    <MUIHelpOutlineIcon color="primary" />
                  </MUITooltip>
                </div>
              </React.Fragment>
            ) : (
              <MUITypography variant="h2">{title}</MUITypography>
            )
          }
          subheader={
            <React.Fragment>
              <MUITypography color="textSecondary" variant="subtitle1">
                A work of genius by: <Link to={`/account/${author._id}`}>{author.name}</Link>
              </MUITypography>
              <MUITypography color="textSecondary" variant="subtitle2">
                {`Last updated ${new Date(parseInt(updatedAt)).toLocaleString()}.`}
              </MUITypography>
            </React.Fragment>
          }
          action={
            author._id === userID && (
              <MUIButton
                color="secondary"
                onClick={() => {
                  setEditing((prevState) => !prevState);
                }}
                startIcon={editing ? <MUIVisibilityOutlinedIcon /> : <MUIEditOutlinedIcon />}
              >
                {editing ? 'Preview' : 'Edit'}
              </MUIButton>
            )
          }
        />
        <MUICardContent>
          {author._id === userID && editing ? (
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
                style={{ marginBottom: 16, marginTop: 16 }}
                type="text"
                value={image}
              />

              <ScryfallRequest
                buttonText="Include"
                labelText="Discuss a card"
                onSubmit={(cardData) => {
                  setBlogPostState((prevState) => ({
                    ...prevState,
                    body: prevState.body.concat(
                      `\n## ${cardData.name.replace(
                        '//',
                        '/'
                      )}\n\n<figure class="left-float">\n<image alt="${
                        cardData.name.replace('//', '/').split('/')[0]
                      }" class="magic-card" src="${
                        cardData.image_uris
                          ? cardData.image_uris.large
                          : cardData.card_faces[0].image_uris.large
                      }">\n<figcaption>***Insert amazing commentary here***</figcaption>\n</figure>\n\n${
                        !cardData.image_uris
                          ? `<figure class="right-float">\n<image alt="${
                              cardData.name.replace('//', '/').split('/')[1]
                            }" class="magic-card" src="${
                              cardData.card_faces[1].image_uris.large
                            }">\n<figcaption>***Insert amazing commentary here***</figcaption>\n</figure>\n`
                          : ''
                      }\n\n<br style="clear: both;">\n\n`
                    )
                  }));
                }}
              />

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
                style={{ marginTop: 16 }}
                type="text"
                value={body}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <MUITypography variant="h3">{subtitle}</MUITypography>
              <article className={article}>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{body}</ReactMarkdown>
              </article>
            </React.Fragment>
          )}
        </MUICardContent>
        {author._id === userID && (
          <MUICardActions style={{ justifyContent: 'flex-end' }}>
            {blogPostID === 'new-post' ? (
              <MUIButton
                color={success ? 'success' : 'primary'}
                disabled={posting}
                onClick={async () => {
                  try {
                    setPosting(true);
                    await createBlogPost({
                      queryString: `{
                        _id
                      }`,
                      variables: { body, image, published, subtitle, title }
                    });
                    setSuccess(true);
                    setTimeout(() => {
                      navigate('/blog');
                    }, 1000);
                  } catch (error) {
                    setErrorMessages((prevState) => [...prevState, error.message]);
                  } finally {
                    setPosting(false);
                  }
                }}
                startIcon={(() => {
                  if (posting) {
                    return <MUICircularProgress size={13} style={{ color: 'inherit' }} />;
                  }
                  if (success) {
                    return <MUIPublishedWithChangesOutlinedIcon />;
                  }
                  return <MUIPostAddOutlinedIcon />;
                })()}
              >
                Create
              </MUIButton>
            ) : (
              <MUIButton
                color={success ? 'success' : 'primary'}
                disabled={posting}
                onClick={async () => {
                  setPosting(true);
                  try {
                    await editBlogPost({
                      headers: { BlogPostID: blogPostID },
                      queryString: `{
                          _id
                        }`,
                      variables: { body, image, published, subtitle, title }
                    });
                    setSuccess(true);
                    setTimeout(() => {
                      navigate('/blog');
                    }, 1000);
                  } catch (error) {
                    setErrorMessages((prevState) => [...prevState, error.message]);
                  } finally {
                    setPosting(false);
                  }
                }}
                startIcon={(() => {
                  if (posting) {
                    return <MUICircularProgress size={13} style={{ color: 'inherit' }} />;
                  }
                  if (success) {
                    return <MUIPublishedWithChangesOutlinedIcon />;
                  }
                  return <MUISaveOutlinedIcon />;
                })()}
              >
                Update
              </MUIButton>
            )}
          </MUICardActions>
        )}
      </MUICard>

      {blogPostID !== 'new-post' && (
        <AutoScrollMessages
          messages={comments}
          submitFunction={(value) =>
            createComment({ headers: { BlogPostID: blogPostID }, variables: { body: value } })
          }
          title="Community Reaction"
        />
      )}
    </React.Fragment>
  );
}
