import axios from "axios";
const BASE_URL = "https://route-posts.routemisr.com/notifications/unread-count";
const getUnreadCount = async () => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.get(`${BASE_URL}`, {
            headers: {
                token: userToken
            }
        });
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export default getUnreadCount;