import getNotifications from "../Api/notifications/getNotifications";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import noNotification from "../asset/emptyNotification.png";
import { timeAgo } from "../Utils/utils";
import getUnreadCount from "../Api/notifications/getUnreadCount";
import markOneRead from "../Api/notifications/markOneRead";
import markAllRead from "../Api/notifications/markAllRead";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getNotifications()
            .then((res) => {
                setNotifications(res.notifications || []);
            })
            .catch((err) => {
                console.error("Error fetching notifications:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const getMessage = (type) => {
        switch (type) {
            case "comment_post":
                return "commented on your post";
            case "like_post":
                return "liked your post";
            case "share_post":
                return "shared your post";
            case "follow":
                return "started following you";
            default:
                return "interacted with your content";
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-10 px-4 my-4">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                    Back
                </button>

                <button
                    onClick={markAllRead}
                    className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity duration-200"
                >
                    Mark all as read
                </button>
            </div>


            {isLoading ? (
                <p className="text-center text-[var(--color-text-secondary)] mt-10">
                    Loading...
                </p>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 card">
                    <img
                        src={noNotification}
                        alt="No notifications"
                        className="mt-3 w-full max-h-130 object-cover"
                    />
                    <p className="text-center text-text-secondary text-sm max-w-[260px]">
                        You don't have any notifications
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {notifications.map((notification) => {
                        const { actor, type, entity, createdAt, isRead } = notification;

                        return (
                            <div
                                key={notification._id}
                                onClick={() => {
                                    markOneRead(notification._id);
                                    navigate(`/post-details/${entity._id}`);
                                }}
                                className={`card flex items-start gap-3 p-4 ${!isRead ? "bg-[var(--color-accent-soft)]" : ""
                                    }`}
                            >
                                <img
                                    src={actor?.photo}
                                    alt={actor?.name}
                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-text-primary">
                                        <span className="font-semibold">{actor?.name}</span>{" "}
                                        {getMessage(type)}
                                    </p>
                                    {entity?.body && (
                                        <p className="text-xs text-text-secondary mt-0.5 truncate">
                                            "{entity.body}"
                                        </p>
                                    )}
                                    {createdAt && (
                                        <span className="text-xs text-text-secondary mt-1 block">
                                            {timeAgo(createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}