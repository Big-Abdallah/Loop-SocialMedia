import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts";

const addReplyApi = async (postId, commentId, content, imageFile) => {
    const userToken = localStorage.getItem("token");
    try {
        const formData = new FormData();
        formData.append("content", content);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const response = await axios.post(
            `${API_URL}/${postId}/comments/${commentId}/replies`,
            formData,
            {
                headers: {
                    token: userToken,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
};

export default addReplyApi;