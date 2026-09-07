import axios from "axios";
const API_URL = "https://route-posts.routemisr.com/posts";

const updateCommentApi = async (postId, commentId, content, imageFile) => {
    const userToken = localStorage.getItem("token");
    try {
        const formData = new FormData();
        formData.append("content", content);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const response = await axios.put(
            `${API_URL}/${postId}/comments/${commentId}`,
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

export default updateCommentApi;