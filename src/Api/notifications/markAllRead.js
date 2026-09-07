// Api/notifications/markAllRead.js
import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com/notifications";

const markAllRead = async () => {
  const userToken = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${BASE_URL}/read-all`,
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

export default markAllRead;