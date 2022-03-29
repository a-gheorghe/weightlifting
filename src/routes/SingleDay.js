import React, { useState, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useQuery, useMutation, queryClient } from "react-query";
import { getFirestore } from "firebase/firestore";
import dayjs from "dayjs";
import { getMediaDayFirebase } from "../firebase-api";
import { renderMediaItem, isAdmin } from "../utils";
import {
  deleteMediaItemFirebase,
  removeTagMediaItemFirebase,
  addTagMediaItemFirebase,
} from "../firebase-api";
import { UserContext } from "../UserContext";

import { Tags } from "../Tags";

const StyledPage = styled.div`
  background-color: #f2f6fd;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// get all media from firebase for this day

export default function SingleDay() {
  const db = getFirestore();
  const { user } = useContext(UserContext);

  // mutations
  const deleteMedia = useMutation(
    ({ db, item }) => deleteMediaItemFirebase(db, item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("media");
      },
    }
  );

  const removeTag = useMutation(
    ({ db, item, tag }) => removeTagMediaItemFirebase(db, item, tag),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("media");
      },
    }
  );

  const addTag = useMutation(
    ({ db, item, tag }) => addTagMediaItemFirebase(db, item, tag),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("media");
      },
    }
  );

  const [localMedia, setLocalMedia] = useState([]);

  // month from params is starting with Jan = 1
  const { year, month, day } = useParams();
  console.log("year month day", year, month, day);
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  console.log("date is", date);
  const nextDay = dayjs(date).add(1, "day").format("YYYY-MM-DD").split("-");
  const prevDay = dayjs(date)
    .subtract(1, "day")
    .format("YYYY-MM-DD")
    .split("-");
  console.log("nextday is", nextDay);
  console.log("prevday is", prevDay);

  // server state
  const { data: media, isLoading: isLoadingMedia } = useQuery(
    ["media", date],
    () => getMediaDayFirebase(db, date)
  );

  // useEffects
  React.useEffect(() => {
    if (media) {
      setLocalMedia(media.map((m) => ({ ...m, inputValue: "" })));
    }
  }, [media]);

  const onTagInputChange = (event, item) => {
    const index = localMedia.findIndex((existingMedia) => {
      return existingMedia.id === item.id;
    });
    localMedia[index] = {
      ...localMedia[index],
      inputValue: event.target.value,
    };
    setLocalMedia([...localMedia]);
  };

  console.log("media is", media);
  return (
    <StyledPage>
      <Link to={`/calendar/${prevDay[0]}/${prevDay[1]}/${prevDay[2]}`}>
        {" "}
        Previous day{" "}
      </Link>
      <Link to={`/calendar/${nextDay[0]}/${nextDay[1]}/${nextDay[2]}`}>
        {" "}
        Next day{" "}
      </Link>

      <button> Add media </button>
      {isLoadingMedia && <div> loading </div>}
      {media &&
        media.map((item) => {
          const localItem = localMedia.find((lm) => lm.id === item.id);

          return (
            <div
              key={item.url}
              style={{
                border: "2px solid pink",
                margin: "10px 0",
              }}
            >
              {renderMediaItem(item.type, item.url)}
              <Tags
                tags={item.tags}
                onAdd={() =>
                  addTag.mutate({ item, tag: localItem?.inputValue })
                }
                onRemove={(tag) => removeTag.mutate({ item, tag })}
                onChange={(e) => onTagInputChange(e, item)}
                value={localItem?.inputValue}
                isAdmin={isAdmin(user)}
              />
              {isAdmin(user) && (
                <div>
                  <button onClick={() => deleteMedia.mutate(item)}>
                    Delete item
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </StyledPage>
  );
}
