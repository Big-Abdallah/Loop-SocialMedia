import axios from "axios";
const BASE_URL = "https://route-posts.routemisr.com/users/";
const getUserPosts = async (id) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.get(`${BASE_URL}/${id}/posts`, {
            headers: {
                token: userToken
            }
        });
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export default getUserPosts;