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
import WarningButton from '../components/miscellaneous/WarningButton';
import { AuthenticationContext } from '../contexts/authentication-context';
import { deleteBlogPost as deleteBlogPostRequest, fetchAllBlogPosts } from '../requests/REST/blog-requests';

const useStyles = makeStyles({
  fullHeight: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '& .MuiCardHeader-root': {
      flexGrow: 1
    }
  }
});

export default function Blog () {

  const authentication = React.useContext(AuthenticationContext);
  const [blogPosts, setBlogPosts] = React.useState([]);
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchBlogPosts () {
      try {
        setLoading(true);
        const allBlogPosts = await fetchAllBlogPosts();
        setBlogPosts(allBlogPosts);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogPosts();
  }, []);

  async function deleteBlogPost (blogPostId) {
    try {
      await deleteBlogPostRequest(blogPostId, authentication.token);
      setBlogPosts((prevState) => {
        return prevState.filter((blogPost) => blogPost._id !== blogPostId);
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    loading ?
      <LoadingSpinner /> :
      <MUIGrid container spacing={2}>
        {authentication.isAdmin &&
          <MUIGrid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <MUICard className={classes.fullHeight}>
              <MUICardHeader
                title={<MUITypography variant="subtitle1">New Article</MUITypography>}
                subheader={
                  <MUITypography color="textSecondary" variant="subtitle2">
                    The world eagerly awaits your opinions on shit
                  </MUITypography>
                }
              />
              <MUICardMedia
                image="https://c1.scryfall.com/file/scryfall-cards/art_crop/front/c/b/cb3b35b8-f321-46d8-a441-6b9a6efa9021.jpg?1562304347"
              />
              <MUICardActions>
                <MUIButton
                  className={classes.iconButton}
                  color="primary"
                  onClick={() => history.push('/blog/new-post')}
                  size="small"
                  startIcon={<MUICreateIcon />}
                  variant="contained"
                >
                  Write
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
                <MUICardActions>
                  <MUIButton
                    color="primary"
                    onClick={() => history.push(`/blog/${blogPost._id}`)}
                    size="small"
                    variant="contained"
                  >
                    Read
                  </MUIButton>
                  {blogPost.author === authentication.userId &&
                    <WarningButton
                      onClick={() => deleteBlogPost(blogPost._id)}
                      startIcon={<MUIDeleteForeverIcon />}
                    >
                      Delete
                    </WarningButton>
                  }
                </MUICardActions>
              </MUICard>
            </MUIGrid>
          );
        })}
      </MUIGrid>
  );
};