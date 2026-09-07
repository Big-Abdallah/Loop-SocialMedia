import axios from "axios";
const BASE_URL = "https://route-posts.routemisr.com/posts";
const toggleBookMark = async (userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${BASE_URL}/${userId}/bookmark`, {}, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export default toggleBookMark;