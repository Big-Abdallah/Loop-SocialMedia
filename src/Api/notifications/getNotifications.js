import axios from "axios";
const BASE_URL = "https://route-posts.routemisr.com/notifications";
const getNotifications = async () => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.get(`${BASE_URL}`, {
            headers: {
                token: userToken
            }
        });
        // console.log(response.data);
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export default getNotifications;