import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com/notifications";

const markOneRead = async (notificationId) => {
  const userToken = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${BASE_URL}/${notificationId}/read`,
      {},
      {
        headers: {
          token: userToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export default markOneRead;