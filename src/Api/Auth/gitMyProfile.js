import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/users/profile-data";
const getMyProfile = async () => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.get(API_URL, {
            headers: {
                token:userToken
            }
        });
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
 }

export default getMyProfile;
