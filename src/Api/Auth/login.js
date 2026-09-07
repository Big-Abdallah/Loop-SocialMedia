import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/users/signin";
const loginApi = async (formData) => { 
    try {
        const response = await axios.post(API_URL, formData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
 }

export default loginApi;
// conalira@mailinator.com
// 