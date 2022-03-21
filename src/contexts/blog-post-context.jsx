import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import BlogPost from '../pages/BlogPost';
import { AuthenticationContext } from './Authentication';

export const BlogPostContext = createContext({
  loading: false,
  blogPostState: {
    _id: '',
    author: {
      _id: '',
      avatar: {
        card_faces: [],
        image_uris: null
      },
      name: ''
    },
    body: '',
    comments: [],
    image: '',
    published: false,
    subtitle: '',
    title: '',
    createdAt: 0,
    updatedAt: 0
  },
  createComment: () => null,
  setBlogPostState: () => null
});

export default function ContextualizedBlogPostPage() {
  const { blogPostID } = useParams();
  const { avatar, userID, userName } = useContext(AuthenticationContext);
  const [blogPostState, setBlogPostState] = useState({
    _id: null,
    author: {
      _id: '',
      avatar: {
        card_faces: [],
        image_uris: null
      },
      name: '...'
    },
    body: '',
    comments: [],
    image: '',
    published: false,
    subtitle: '',
    title: '',
    createdAt: null,
    updatedAt: null
  });
  const blogPostQuery = `
    _id
    author {
      _id
      avatar {
        card_faces {
          image_uris {
            art_crop
          }
        }
        image_uris {
          art_crop
        }
      }
      name
    }
    body
    comments {
      _id
      author {
        _id
        avatar {
          card_faces {
            image_uris {
              art_crop
            }
          }
          image_uris {
            art_crop
          }
        }
        name
      }
      body
      createdAt
      updatedAt
    }
    image
    published
    subtitle
    title
    createdAt
    updatedAt
  `;
  const { loading, sendRequest } = useRequest();

  const createComment = useCallback(
    async function (newComment) {
      await sendRequest({
        headers: { BlogPostID: blogPostID },
        operation: 'createComment',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(body: "${newComment}") {
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
        },
        createdAt: Number(new Date()),
        updatedAt: Number(new Date())
      }));
    }
  }, [blogPostID]);

  return (
    <BlogPostContext.Provider
      value={{
        loading,
        blogPostState,
        createComment,
        setBlogPostState
      }}
    >
      <BlogPost />
    </BlogPostContext.Provider>
  );
}
