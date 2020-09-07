import React from 'react';
import { useHistory } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUICardMedia from '@material-ui/core/CardMedia';
import MUICardActions from '@material-ui/core/CardActions';
import MUIGrid from '@material-ui/core/Grid';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  fullHeight: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: 0,
    '& .MuiCardHeader-root': {
      flexGrow: 1
    }
  }
});

const Blog = () => {
  const [blogPosts, setBlogPosts] = React.useState([]);
  const { loading, sendRequest } = useRequest();

  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    const fetchBlogPosts = async function () {
      try {
        const blogPostsData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/blog`, 'GET', null, {});
        setBlogPosts(blogPostsData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlogPosts();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <MUIGrid container spacing={2}>
          {blogPosts.map(function (blogPost) {
            return (
              <MUIGrid item key={blogPost._id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <MUICard className={classes.fullHeight}>
                  <MUICardHeader
                    title={<MUITypography variant="subtitle1">{blogPost.title}</MUITypography>}
                    subheader={<MUITypography variant="subtitle2">{blogPost.subtitle}</MUITypography>}
                  />
                  <MUICardMedia
                    image={blogPost.image}
                  />
                  <MUICardActions>
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