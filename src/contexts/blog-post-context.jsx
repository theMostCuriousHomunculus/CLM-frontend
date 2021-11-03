import React, { createContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import BlogPost from '../pages/BlogPost';
import { AuthenticationContext } from './authentication-context';

export const BlogPostContext = createContext({
  loading: false,
  blogPostState: {
    _id: null,
    author: {
      _id: null,
      avatar: null,
      name: null
    },
    body: null,
    comments: [],
    image: null,
    subtitle: null,
    title: null,
    createdAt: null,
    updatedAt: null
  },
  createBlogPost: () => null,
  createComment: () => null,
  editBlogPost: () => null,
  setBlogPostState: () => null,
  setViewMode: () => null,
  viewMode: null
});

export default function ContextualizedBlogPostPage() {
  const history = useHistory();
  const { blogPostID } = useParams();
  const { avatar, userID, userName } = React.useContext(AuthenticationContext);
  const [blogPostState, setBlogPostState] = React.useState({
    _id: null,
    author: {
      _id: '',
      avatar: '',
      name: '...'
    },
    body: '',
    comments: [],
    image: '',
    subtitle: '',
    title: '',
    createdAt: null,
    updatedAt: null
  });
  const [viewMode, setViewMode] = React.useState('Live');
  const blogPostQuery = `
    _id
    author {
      _id
      avatar
      name
    }
    body
    comments {
      _id
      author {
        _id
        avatar
        name
      }
      body
      updatedAt
    }
    image
    subtitle
    title
    createdAt
    updatedAt
  `;
  const { loading, sendRequest } = useRequest();
  const { requestSubscription } = useSubscribe();

  const createBlogPost = React.useCallback(
    async function () {
      await sendRequest({
        callback: () => {
          setTimeout(() => history.push('/blog'), 0);
        },
        operation: 'createBlogPost',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                body: """${blogPostState.body}""",
                image: "${blogPostState.image}",
                subtitle: "${blogPostState.subtitle}",
                title: "${blogPostState.title}"
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [sendRequest]
  );

  const createComment = React.useCallback(
    async function (newComment) {
      await sendRequest({
        callback: () => {
          newComment.current.value = '';
          newComment.current.focus();
        },
        headers: { BlogPostID: blogPostID },
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
          };
        }
      });
    },
    [sendRequest]
  );

  const editBlogPost = React.useCallback(
    async function () {
      await sendRequest({
        callback: () => {
          setTimeout(() => history.push('/blog'), 0);
        },
        header: {
          BlogPostID: blogPostID
        },
        operation: 'editBlogPost',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  body: """${blogPostState.body}""",
                  image: "${blogPostState.image}",
                  subtitle: "${blogPostState.subtitle}",
                  title: "${blogPostState.title}"
                ) {
                  _id
                }
              }
            `
          };
        }
      });
    },
    [blogPostID, sendRequest]
  );

  const fetchBlogPostByID = React.useCallback(
    async function () {
      await sendRequest({
        callback: setBlogPostState,
        headers: { BlogPostID: blogPostID },
        load: true,
        operation: 'fetchBlogPostByID',
        get body() {
          return {
            query: `
              query {
                ${this.operation} {
                  ${blogPostQuery}
                }
              }
            `
          };
        }
      });
    },
    [blogPostQuery, blogPostID, sendRequest]
  );

  React.useEffect(() => {
    if (blogPostID === 'new-post') {
      setBlogPostState((prevState) => ({
        ...prevState,
        _id: 'new-post',
        author: {
          _id: userID,
          avatar,
          name: userName
        }
      }));
      setViewMode('Edit');
    } else {
      requestSubscription({
        headers: { blogPostID },
        queryString: blogPostQuery,
        setup: fetchBlogPostByID,
        subscriptionType: 'subscribeBlogPost',
        update: setBlogPostState
      });
    }
  }, [blogPostID, blogPostQuery, fetchBlogPostByID, requestSubscription]);

  return (
    <BlogPostContext.Provider
      value={{
        loading,
        blogPostState,
        createBlogPost,
        createComment,
        editBlogPost,
        setBlogPostState,
        setViewMode,
        viewMode
      }}
    >
      <BlogPost />
    </BlogPostContext.Provider>
  );
}
