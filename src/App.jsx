import React from "react";
import { createBrowserRouter, RouterProvider , Navigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Feed from "./Page/Feed";
import NotFound from "./Page/Notfound";
import Login from "./Page/Auth/Login";
import AuthLayout from "./Layouts/AuthLayout";
import Register from "./Page/Auth/Register";
import PostDetails from "./Page/PostDetails";
import Profile from "./Page/Profile";
import Notification from "./Page/Notifications";
import AuthProtectedRoute from "./ProtectedRoutes/AuthProtectedRoute";
import MainProtectedRoute from "./ProtectedRoutes/MainProtectedRoute";
import UserProfile from "./Page/userProfile";
import FollowSuggestions from "./Page/FollowSuggestions";
import FollowingFeed from "./Page/FoloowingPosts";
import PostLikes from "./Components/Post/PostLiks";

export default function App() {
  
  const router = createBrowserRouter([
    {
      path: "",
      element: <AuthLayout/>,
      children: [
        { path: "/login", element: <AuthProtectedRoute><Login /></AuthProtectedRoute> },
        { path: "/register", element: <AuthProtectedRoute><Register /></AuthProtectedRoute> },
      ],
    },
    {
      path: "",
      element: <MainLayout />,
      children: [
        { index: true, element: <MainProtectedRoute><Feed /></MainProtectedRoute> },
        { path: "/feed", element: <MainProtectedRoute><Feed /></MainProtectedRoute> },
        { path: "/post-details/:id", element: <MainProtectedRoute><PostDetails /></MainProtectedRoute> },
        { path: "/profile", element: <MainProtectedRoute><Profile /></MainProtectedRoute> },
        { path: "/notifications", element: <MainProtectedRoute><Notification /></MainProtectedRoute> },
        { path: "/userProfile/:userId", element: <MainProtectedRoute><UserProfile /></MainProtectedRoute> },
        { path: "/post-details/:id/likes", element: <MainProtectedRoute><PostLikes /></MainProtectedRoute> },
        { path: "/suggestions", element: <MainProtectedRoute><FollowSuggestions /></MainProtectedRoute> },
        { path: "/following-feed", element: <MainProtectedRoute><FollowingFeed /></MainProtectedRoute> },
        { path: "*", element: <MainProtectedRoute><NotFound /></MainProtectedRoute> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
