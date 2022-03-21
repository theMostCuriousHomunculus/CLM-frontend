import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import blogPostQuery from '../constants/blog-post-query';
import fetchBlogPostByID from '../graphql/queries/blog/fetch-blog-post-by-ID';
import useSubscribe from '../hooks/subscribe-hook';
import BlogPost from '../pages/BlogPost';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from './Authentication';

export const BlogPostContext = createContext({
  abortControllerRef: { current: new AbortController() },
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
  setBlogPostState: () => null
});

export default function ContextualizedBlogPostPage() {
  const { avatar, userID, userName } = useContext(AuthenticationContext);
  const { blogPostID } = useParams();
  const abortControllerRef = useRef(new AbortController());
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
  const [loading, setLoading] = useState(true);

  if (blogPostID !== 'new-post') {
    useSubscribe({
      cleanup: () => {
        abortControllerRef.current.abort();
      },
      connectionInfo: { blogPostID },
      queryString: blogPostQuery,
      setup: async () => {
        try {
          const response = await fetchBlogPostByID({
            headers: { BlogPostID: blogPostID },
            queryString: blogPostQuery,
            signal: abortControllerRef.current.signal
          });
          setBlogPostState(response.data.fetchBlogPostByID);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      },
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
        abortControllerRef,
        blogPostState,
        setBlogPostState
      }}
    >
      {loading ? <LoadingSpinner /> : <BlogPost />}
    </BlogPostContext.Provider>
  );
}
