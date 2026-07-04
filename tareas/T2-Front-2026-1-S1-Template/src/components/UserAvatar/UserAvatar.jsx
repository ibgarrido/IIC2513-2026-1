import { useEffect, useState } from "react";
import { userProfileImageUrl, userProfileImageRaw } from "../../utils/userFromApi";
import "./UserAvatar.css";

export default function UserAvatar({ user, size = "md", className = "" }) {
  const letter = user?.username?.charAt(0)?.toUpperCase() ?? "?";
  const raw = user ? userProfileImageRaw(user) : "";
  const url = user ? userProfileImageUrl(user) : "";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [raw]);

  const showImg = Boolean(url && !failed);

  const rootClass = ["user-avatar", `user-avatar--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={rootClass} aria-hidden={showImg ? undefined : true}>
      {showImg ? (
        <img
          className="user-avatar-img"
          src={url}
          alt=""
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="user-avatar-letter">{letter}</span>
      )}
    </span>
  );
}
