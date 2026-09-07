import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts";

const deleteCommentApi = async (postId, commentId) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.delete(
            `${API_URL}/${postId}/comments/${commentId}`,
            {
                headers: {
                    token: userToken,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
};

export default deleteCommentApi;