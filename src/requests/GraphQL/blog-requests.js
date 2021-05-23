import axios from 'axios';

async function deleteBlogPost (blogPostId, token) {
  try {
    await axios.delete(`${process.env.REACT_APP_REST_URL}/blog/${blogPostId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function editBlogPost (details, blogPostId, token) {
  try {
    await axios.patch(`${process.env.REACT_APP_REST_URL}/blog/${blogPostId}`, details, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function fetchAllBlogPosts () {
  try {
    const allBlogPosts = await axios.get(`${process.env.REACT_APP_REST_URL}/blog`);
    return allBlogPosts.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function fetchBlogPostById (blogPostId) {
  try {
    const blogPost = await axios.get(`${process.env.REACT_APP_REST_URL}/blog/${blogPostId}`);
    return blogPost.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function publish (details, token) {
  try {
    await axios.post(`${process.env.REACT_APP_REST_URL}/blog`, details, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export {
  deleteBlogPost,
  editBlogPost,
  fetchAllBlogPosts,
  fetchBlogPostById,
  publish
};