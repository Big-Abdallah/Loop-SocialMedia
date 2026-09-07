// Api/Posts/createPostApi.js
import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts";

const createPostApi = async (body, imageFile) => {
    const userToken = localStorage.getItem("token");
    try {
        const formData = new FormData();
        formData.append("body", body);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const response = await axios.post(API_URL, formData, {
            headers: {
                token: userToken,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
};

export default createPostApi;