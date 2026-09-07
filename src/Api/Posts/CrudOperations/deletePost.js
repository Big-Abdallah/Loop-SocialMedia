import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts/";

const deletePostApi = async (postId) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.delete(API_URL+postId, {
            headers: {
                token:userToken
            }
        });
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
 }

export default deletePostApi;
