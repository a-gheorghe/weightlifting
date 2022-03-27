import React, { useState, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { AiOutlineFilter } from "react-icons/ai";
import {
  getMediaFirebase,
  deleteMediaItemFirebase,
  removeTagMediaItemFirebase,
  addTagMediaItemFirebase,
} from "./firebase-api";
import { timestampToDate } from "./utils";
import { FilterComponent } from "./Filter";
import { Tags } from "./Tags";
import { isAdmin } from "./utils";
import { UserContext } from "./UserContext";

const firebaseConfig = {
  apiKey: "AIzaSyALCegZh1IrbCVcYXVtMvlfE75nM-UbJXA",
  authDomain: "weightlifting-333222.firebaseapp.com",
  projectId: "weightlifting-333222",
  storageBucket: "weightlifting-333222.appspot.com",
  messagingSenderId: "1043715347799",
  appId: "1:1043715347799:web:f1838726ad800d9c341a12",
  measurementId: "G-J87TRX6H7N",
};

initializeApp(firebaseConfig);

const renderMediaItem = (type, url) => {
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

const groupByDate = (array = []) => {
  return array.reduce((result, currentItem) => {
    (result[timestampToDate(currentItem.timestamp)] =
      result[timestampToDate(currentItem.timestamp)] || []).push(currentItem);
    return result;
  }, {});
};

function App() {
  const db = getFirestore();
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);

  // server state
  const { data: media, isLoading: isLoadingMedia } = useQuery("media", () =>
    getMediaFirebase(db)
  );

  // local state
  const [localMedia, setLocalMedia] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [basicTags, setBasicTags] = useState([]);
  const [advancedTags, setAdvancedTags] = useState([]);

  // useEffects
  React.useEffect(() => {
    if (media) {
      setLocalMedia(media.map((m) => ({ ...m, inputValue: "" })));
    }
  }, [media]);

  // mutations
  const deleteMedia = useMutation((item) => deleteMediaItemFirebase(db, item), {
    onSuccess: () => {
      queryClient.invalidateQueries("media");
    },
  });

  const removeTag = useMutation(
    ({ item, tag }) => removeTagMediaItemFirebase(db, item, tag),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("media");
      },
    }
  );

  const addTag = useMutation(
    ({ item, tag }) => addTagMediaItemFirebase(db, item, tag),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("media");
      },
    }
  );
  // variables

  const groupedMedia = groupByDate(media);

  // functions

  const shouldShowMedia = (tags) => {
    if (showFilter) {
      return (
        tags.some((tag) => basicTags.includes(tag)) &&
        advancedTags.every((element) => tags.includes(element))
      );
    }
    return true;
  };

  const onTagInputChange = (event, item) => {
    console.log("event.target.value", event.target.value);
    const index = localMedia.findIndex((existingMedia) => {
      return existingMedia.id === item.id;
    });
    localMedia[index] = {
      ...localMedia[index],
      inputValue: event.target.value,
    };
    setLocalMedia([...localMedia]);
  };

  if (isLoadingMedia) {
    return <div> loading </div>;
  }

  return (
    <main style={{ padding: "1rem 0" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setShowFilter(!showFilter)}>
            {!showFilter ? (
              <>
                <span>Filter</span>
                <AiOutlineFilter size={20} />
              </>
            ) : (
              <>
                <span>Close</span>
              </>
            )}
          </button>
        </div>
        {showFilter && (
          <FilterComponent
            basicTags={basicTags}
            setBasicTags={setBasicTags}
            advancedTags={advancedTags}
            setAdvancedTags={setAdvancedTags}
          />
        )}
      </div>

      {Object.entries(groupedMedia).map((entry) => {
        const date = entry[0];
        const mediaArray = entry[1];
        return (
          <div key={entry.date} style={{ marginBottom: "10px" }}>
            <strong>{date}</strong>
            {mediaArray.map((item) => {
              const localItem = localMedia.find((lm) => lm.id === item.id);
              console.log("localItem is", localItem);
              return (
                shouldShowMedia(item.tags) && (
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
                )
              );
            })}
          </div>
        );
      })}
    </main>
  );
}

export default App;
