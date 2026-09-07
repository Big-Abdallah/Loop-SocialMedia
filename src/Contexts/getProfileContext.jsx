import React, { createContext, useState, useEffect } from 'react'
import getMyProfile from '../Api/Auth/gitMyProfile' // تأكد من اسم الملف الصح
import getUnreadCount from '../Api/notifications/getUnreadCount'
export const getProfileContext = createContext({})

export default function GetProfileContextProvider({ children }) {
  const [data, setData] = useState(null);
  const [unreadCount , setUnreadCount] = useState();
  async function getProfile() {

    try {
      const res = await getMyProfile();
      const user = res.user ?? res;
      setData(user);
      return user;
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }
  
  useEffect(() => {
    getProfile();
    getUnreadCount()
      .then((res) => {
        setUnreadCount(res.unreadCount)
      })
      .catch((err) => {
        console.error("Error fetching unread count:", err);
      });
  }, []);

  const {
    name,
    username,
    photo,
    cover,
    followersCount,
    followingCount,
    bookmarksCount,
    createdAt,
    dateOfBirth,
    id,
  } = data || {}; // ← الحل: fallback لـ object فاضي لو data لسه null

  return (
    <getProfileContext.Provider
      value={{
        name,
        username,
        photo,
        cover,
        followersCount,
        followingCount,
        bookmarksCount,
        createdAt,
        dateOfBirth,
        id,
        refetchProfile: getProfile, // مفيد لو حبيت تعمل refresh بعد تعديل البروفايل
        unreadCount
      }}
    >
      {children}
    </getProfileContext.Provider>
  );
}