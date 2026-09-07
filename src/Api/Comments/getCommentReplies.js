import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts";

const getCommentRepliesApi = async (postId, commentId, page = 1, limit = 10) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.get(
            `${API_URL}/${postId}/comments/${commentId}/replies`,
            {
                params: { page, limit },
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

export default getCommentRepliesApi;