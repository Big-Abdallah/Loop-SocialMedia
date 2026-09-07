import axios from "axios";
const BASE_URL = "https://route-posts.routemisr.com/users";
const toggleFollow = async (userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${BASE_URL}/${userId}/follow`, {}, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export default toggleFollow;