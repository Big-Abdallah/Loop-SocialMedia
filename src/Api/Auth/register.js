import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/users/signup";
const registerApi = async (formData) => { 
    try {
        const response = await axios.post(API_URL, formData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
 }

export default registerApi;
