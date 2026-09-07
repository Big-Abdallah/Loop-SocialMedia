import axios from "axios";
const BASE_URL = "https://route-posts.routemisr.com/users/suggestions";
const getFollowSuggestions = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${BASE_URL}`, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export default getFollowSuggestions;