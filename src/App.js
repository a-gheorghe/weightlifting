import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMediaFirebase, deleteMediaItemFirebase } from "./firebase-api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Tag } from "@chakra-ui/react";
import { AiOutlineFilter } from "react-icons/ai";
import { timestampToDate } from "./utils";
import React from "react";
import { FilterComponent } from "./Filter";

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
  } else {
    return <img src={url} alt="to add description" width="320" height="240" />;
  }
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
  const { data: media, isLoading: isLoadingMedia } = useQuery("media", () =>
    getMediaFirebase(db)
  );
  const groupedMedia = groupByDate(media);
  const [showFilter, setShowFilter] = useState(false);

  const [basicTags, setBasicTags] = useState([]);
  const [advancedTags, setAdvancedTags] = useState([]);
  const deleteMedia = useMutation((item) => deleteMediaItemFirebase(db, item), {
    onSuccess: () => {
      queryClient.invalidateQueries("media");
    },
  });

  const shouldShowMedia = (tags) => {
    if (showFilter) {
      return (
        tags.some((tag) => basicTags.includes(tag)) &&
        advancedTags.every((element) => tags.includes(element))
      );
    }
          console.log('hi')
    return true;

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
              return (
                shouldShowMedia(item.tags) && (
                  <div
                    key={item.url}
                    style={{
                      border: "2px solid pink",
                      margin: "10px 0",
                      display: "flex",
                    }}
                  >
                    {renderMediaItem(item.type, item.url)}
                    {item.tags.map((tag) => (
                      <Tag
                        size="md"
                        key={`${item.id}-${tag}`}
                        variant="solid"
                        colorScheme="teal"
                      >
                        {tag}
                      </Tag>
                    ))}
                    <div>
                      <button onClick={() => deleteMedia.mutate(item)}>
                        {" "}
                        Delete item{" "}
                      </button>
                    </div>
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
