import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts/";
const getPostLikesApi = async (postId) => {
    const userToken = localStorage.getItem("token");
    try {
        const response = await axios.get(API_URL+postId+"/likes", {
            headers: {
                token:userToken
            }
        });

        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
 }

export default getPostLikesApi;
