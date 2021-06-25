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

import useRequest from '../hooks/request-hook';
import Avatar from '../components/miscellaneous/Avatar';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import WarningButton from '../components/miscellaneous/WarningButton';
import { AuthenticationContext } from '../contexts/authentication-context';

export default function Blog () {

  const authentication = React.useContext(AuthenticationContext);
  const { loading, sendRequest } = useRequest();
  const [blogPosts, setBlogPosts] = React.useState([]);
  const history = useHistory();

  React.useEffect(() => {
    async function fetchBlogPosts () {
      await sendRequest({
        callback: (data) => {
          setBlogPosts(data);
        },
        load: true,
        operation: 'searchBlogPosts',
        get body() {
          return {
            query: `
              query {
                ${this.operation}(search: "") {
                  _id
                  author {
                    _id
                    avatar
                    name
                  }
                  body
                  createdAt
                  image
                  subtitle
                  title
                  updatedAt
                }
              }
            `
          }
        }
      });
    }

    fetchBlogPosts();
  }, [sendRequest]);

  async function deleteBlogPost (blogPostId) {
    await sendRequest({
      callback: () => {
        setBlogPosts((prevState) => prevState.filter((blogPost) => blogPost._id !== blogPostId));
      },
      operation: 'deleteBlogPost',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(_id: "${blogPostId}")
            }
          `
        }
      }
    });
  }

  return (
    loading ?
      <LoadingSpinner /> :
      <MUIGrid container spacing={0}>
        {authentication.isAdmin &&
          <MUIGrid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <MUICard>
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
              <MUICard>
                <MUICardHeader
                  avatar={<Avatar alt={blogPost.author.name} size='small' src={blogPost.author.avatar} />}
                  subheader={<MUITypography color="textSecondary" variant="subtitle2">{blogPost.subtitle}</MUITypography>}
                  title={<MUITypography variant="subtitle1">{blogPost.title}</MUITypography>}
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
                  {blogPost.author._id === authentication.userId &&
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