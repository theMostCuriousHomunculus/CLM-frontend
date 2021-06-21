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

export {
  deleteBlogPost
};