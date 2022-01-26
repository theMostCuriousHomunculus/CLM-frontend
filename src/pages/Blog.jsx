import React from 'react';
import { useNavigate } from 'react-router-dom';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardHeader from '@mui/material/CardHeader';
import MUICardMedia from '@mui/material/CardMedia';
import MUICardActions from '@mui/material/CardActions';
import MUICreateIcon from '@mui/icons-material/Create';
import MUIDeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MUIGrid from '@mui/material/Grid';
import MUITypography from '@mui/material/Typography';

import useRequest from '../hooks/request-hook';
import Avatar from '../components/miscellaneous/Avatar';
import ConfirmationDialog from '../components/miscellaneous/ConfirmationDialog';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/Authentication';

export default function Blog() {
  const authentication = React.useContext(AuthenticationContext);
  const { loading, sendRequest } = useRequest();
  const [blogPosts, setBlogPosts] = React.useState([]);
  const [blogPostToDelete, setBlogPostToDelete] = React.useState({
    _id: null,
    title: null
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchBlogPosts() {
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
          };
        }
      });
    }

    fetchBlogPosts();
  }, [sendRequest]);

  async function deleteBlogPost() {
    await sendRequest({
      callback: () => {
        setBlogPosts((prevState) =>
          prevState.filter((blogPost) => blogPost._id !== blogPostToDelete._id)
        );
      },
      operation: 'deleteBlogPost',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(_id: "${blogPostToDelete._id}")
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
      <ConfirmationDialog
        confirmHandler={() => {
          deleteBlogPost();
          setBlogPostToDelete({ _id: null, title: null });
        }}
        open={!!blogPostToDelete._id}
        title={`Are you sure you want to delete ${blogPostToDelete.title}?`}
        toggleOpen={() => setBlogPostToDelete({ _id: null, title: null })}
      >
        <MUITypography variant="body1">
          This action cannot be undone. Your wise counsel and witty humor will
          be lost to the ages...
        </MUITypography>
      </ConfirmationDialog>

      <MUIGrid container spacing={0}>
        {authentication.admin && (
          <MUIGrid container item xs={12} sm={6} md={4} lg={3} xl={2}>
            <MUICard
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
              }}
            >
              <MUICardHeader
                title={
                  <MUITypography variant="subtitle1">New Article</MUITypography>
                }
                style={{ flexGrow: 1 }}
                subheader={
                  <MUITypography color="textSecondary" variant="subtitle2">
                    The world eagerly awaits your opinions on shit
                  </MUITypography>
                }
              />
              <MUICardMedia image="https://c1.scryfall.com/file/scryfall-cards/art_crop/front/c/b/cb3b35b8-f321-46d8-a441-6b9a6efa9021.jpg?1562304347" />
              <MUICardActions>
                <MUIButton
                  onClick={() => navigate('/blog/new-post')}
                  startIcon={<MUICreateIcon />}
                >
                  Write
                </MUIButton>
              </MUICardActions>
            </MUICard>
          </MUIGrid>
        )}
        {blogPosts.map((blogPost) => (
          <MUIGrid
            container
            item
            key={blogPost._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <MUICard
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
              }}
            >
              <MUICardHeader
                avatar={
                  <Avatar
                    alt={blogPost.author.name}
                    size="small"
                    src={blogPost.author.avatar}
                  />
                }
                subheader={
                  <MUITypography color="textSecondary" variant="subtitle2">
                    {blogPost.subtitle}
                  </MUITypography>
                }
                style={{ flexGrow: 1 }}
                title={
                  <MUITypography variant="subtitle1">
                    {blogPost.title}
                  </MUITypography>
                }
              />
              <MUICardMedia image={blogPost.image} />
              <MUICardActions>
                <MUIButton onClick={() => navigate(`/blog/${blogPost._id}`)}>
                  Read
                </MUIButton>
                {blogPost.author._id === authentication.userID && (
                  <MUIButton
                    color="warning"
                    onClick={() =>
                      setBlogPostToDelete({
                        _id: blogPost._id,
                        title: blogPost.title
                      })
                    }
                    startIcon={<MUIDeleteForeverIcon />}
                  >
                    Delete
                  </MUIButton>
                )}
              </MUICardActions>
            </MUICard>
          </MUIGrid>
        ))}
      </MUIGrid>
    </React.Fragment>
  );
}
