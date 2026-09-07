import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/users/upload-photo";

const uploadProfilePhoto = async (formData) => {
  try {
    const userToken = localStorage.getItem("token");
    const response = await axios.put(API_URL, formData, {
      headers: {
        token: userToken,
        "Content-Type": "multipart/form-data", // تأكيد صريح
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export default uploadProfilePhoto;