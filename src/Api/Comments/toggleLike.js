import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts";

const toggleCommentLikeApi = async (postId, commentId) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.put(
            `${API_URL}/${postId}/comments/${commentId}/like`,
            {},
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

export default toggleCommentLikeApi;