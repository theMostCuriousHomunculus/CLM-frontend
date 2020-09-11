import React from 'react';
import { useHistory } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUICardMedia from '@material-ui/core/CardMedia';
import MUICardActions from '@material-ui/core/CardActions';
import MUICreateIcon from '@material-ui/icons/Create';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIGrid from '@material-ui/core/Grid';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import theme from '../theme';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  fullHeight: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '& .MuiCardHeader-root': {
      flexGrow: 1
    }
  },
  iconButton: {
    height: 40
  },
  spaceBetween: {
    justifyContent: 'space-between'
  },
  warningButton: {
    backgroundColor: theme.palette.warning.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  },
});

const Blog = () => {
  const [blogPosts, setBlogPosts] = React.useState([]);
  const { loading, sendRequest } = useRequest();

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    async function fetchBlogPosts () {
      try {
        const blogPostsData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog`, 'GET', null, {});
        setBlogPosts(blogPostsData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBlogPosts();
  }, [sendRequest]);

  async function deleteBlogPost (blogPostId) {
    try {
      const remainingBlogPosts = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog/${blogPostId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + authentication.token
        }
      );
      setBlogPosts(remainingBlogPosts);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <MUIGrid container spacing={2}>
          {authentication.isAdmin &&
            <MUIGrid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <MUICard className={classes.fullHeight}>
                <MUICardHeader
                  title={<MUITypography variant="subtitle1">New Article</MUITypography>}
                  subheader={<MUITypography color="textSecondary" variant="subtitle2">The world eagerly awaits your opinions on shit</MUITypography>}
                />
                <MUICardMedia
                  image="https://c1.scryfall.com/file/scryfall-cards/art_crop/front/c/b/cb3b35b8-f321-46d8-a441-6b9a6efa9021.jpg?1562304347"
                />
                <MUICardActions>
                  <MUIButton
                    className={classes.iconButton}
                    color="primary"
                    onClick={() => history.push('/blog/new-post')}
                    variant="contained"
                  >
                    <MUICreateIcon />
                  </MUIButton>
                </MUICardActions>
              </MUICard>
            </MUIGrid>
          }
          {blogPosts.map(function (blogPost) {
            return (
              <MUIGrid item key={blogPost._id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <MUICard className={classes.fullHeight}>
                  <MUICardHeader
                    title={<MUITypography variant="subtitle1">{blogPost.title}</MUITypography>}
                    subheader={<MUITypography color="textSecondary" variant="subtitle2">{blogPost.subtitle}</MUITypography>}
                  />
                  <MUICardMedia
                    image={blogPost.image}
                  />
                  <MUICardActions className={blogPost.author === authentication.userId ? classes.spaceBetween : null}>
                    {blogPost.author === authentication.userId &&
                      <MUIButton
                        className={classes.warningButton}
                        onClick={() => deleteBlogPost(blogPost._id)}
                        startIcon={<MUIDeleteForeverIcon />}
                        variant="contained"
                      >
                        Delete
                      </MUIButton>
                    }
                    <MUIButton
                      color="primary"
                      onClick={() => history.push(`/blog/${blogPost._id}`)}
                      variant="contained"
                    >
                      Read
                    </MUIButton>
                  </MUICardActions>
                </MUICard>
              </MUIGrid>
            );
          })}
        </MUIGrid>
      }
    </React.Fragment>
  );
}

export default Blog;