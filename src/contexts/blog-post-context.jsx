import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import BlogPost from '../pages/BlogPost';
import { AuthenticationContext } from './Authentication';

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
  const navigate = useNavigate();
  const { blogPostID } = useParams();
  const { avatar, userID, userName } = useContext(AuthenticationContext);
  const [blogPostState, setBlogPostState] = useState({
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
  const [viewMode, setViewMode] = useState('Live');
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

  const createBlogPost = useCallback(
    async function () {
      await sendRequest({
        callback: () => {
          setTimeout(() => navigate('/blog'), 0);
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
    [
      blogPostState.body,
      blogPostState.image,
      blogPostState.subtitle,
      blogPostState.title,
      navigate,
      sendRequest
    ]
  );

  const createComment = useCallback(
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

  const editBlogPost = useCallback(
    async function () {
      await sendRequest({
        callback: () => {
          setTimeout(() => navigate('/blog'), 0);
        },
        headers: {
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
    [
      blogPostID,
      blogPostState.body,
      blogPostState.image,
      blogPostState.subtitle,
      blogPostState.title,
      navigate,
      sendRequest
    ]
  );

  const fetchBlogPostByID = useCallback(
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

  if (blogPostID !== 'new-post') {
    useSubscribe({
      connectionInfo: { blogPostID },
      queryString: blogPostQuery,
      setup: fetchBlogPostByID,
      subscriptionType: 'subscribeBlogPost',
      update: setBlogPostState
    });
  }

  useEffect(() => {
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
    }
  }, [blogPostID]);

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
