import React, { createContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import BlogPost from '../pages/BlogPost';
import { AuthenticationContext } from './authentication-context';

export const BlogPostContext = createContext({});

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
    async function (body, image, subtitle, title) {
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
                body: """${body}""",
                image: "${image}",
                subtitle: "${subtitle}",
                title: "${title}"
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

  const editBlogPost = React.useCallback(
    async function (body, image, subtitle, title) {
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
                body: """${body}""",
                image: "${image}",
                subtitle: "${subtitle}",
                title: "${title}"
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
        author: {
          _id: userID,
          avatar,
          name: userName
        }
      }));
    } else {
      requestSubscription({
        headers: { blogPostID },
        queryString: blogPostQuery,
        setup: fetchBlogPostByID,
        subscriptionType: 'subscribeBlogPost',
        update: setBlogPostState
      });
    }
  }, [deckID, deckQuery, fetchDeckByID, requestSubscription, updateDeckState]);

  return (
    <BlogPostContext.Provider value={{}}>
      <BlogPost />
    </BlogPostContext.Provider>
  );
}
