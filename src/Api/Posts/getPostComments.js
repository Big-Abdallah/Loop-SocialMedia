import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/posts";

const getPostComments = async (postId) => {
  const userToken = localStorage.getItem("token");
  const url = `${API_URL}/${postId}/comments`;
  try {
    const response = await axios.get(url, {
      headers: {
        token: userToken,
      },
    });
    return response.data.data;
  } catch (error) {
    return error.response.data;
  }
};

export default getPostComments;