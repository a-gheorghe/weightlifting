import React from "react";
import dayjs from "dayjs";

export const isAdmin = (user) => {
  return user && user.email === "a.s.gheorghe3@gmail.com";
};

export const timestampToDate = (timestamp) => {
  console.log("timestamp is", timestamp);
  return dayjs(timestamp * 1000).format("DD/MM/YYYY");
};

export const renderMediaItem = (type, url) => {
  if (type.includes("video")) {
    return (
      <video
        key={url}
        width="320"
        height="240"
        autoPlay
        muted
        controls
        style={{ display: "block" }}
      >
        <source src={url} type="video/mp4" />
        <source src={url} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    );
  }
  return <img src={url} alt="to add description" width="320" height="240" />;
};
