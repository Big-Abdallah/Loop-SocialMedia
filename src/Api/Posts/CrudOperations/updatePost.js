import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts";
const updatePostApi = async (body, image, postId) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = axios.put(`${API_URL}/${postId}`,
            {
                body,
                image
            },
            { headers: { token: userToken } }
        )
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export default updatePostApi;
