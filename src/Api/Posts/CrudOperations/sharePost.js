import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts";
const sharePostApi = async (body, postId) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/${postId}/share`,
            { body },
            {
                headers: {
                    token: userToken
                }
            }
        )
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export default sharePostApi;
