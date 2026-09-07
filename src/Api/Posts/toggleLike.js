import axios from "axios";
const BASE_URL = "https://route-posts.routemisr.com/posts";
const toggleLike = async (postId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${BASE_URL}/${postId}/like`, {}, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export default toggleLike;