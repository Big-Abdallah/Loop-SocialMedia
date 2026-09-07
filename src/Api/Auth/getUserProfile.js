import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/users";
const getUserProfile = async (userId) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/${userId}/profile`, {
            headers: {
                token:userToken
            }
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
 }

export default getUserProfile;
