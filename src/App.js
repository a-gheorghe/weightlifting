import { useState } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMediaFirebase, deleteMediaItemFirebase } from './firebase-api';
import {
  useQuery,
} from 'react-query'
import { AiOutlineFilter } from 'react-icons/ai';
import { timestampToDate } from "./utils";
import { TagsInput } from './TagsInput';
import React from 'react'
import { FilterComponent } from './Filter';

const firebaseConfig = {
  apiKey: "AIzaSyALCegZh1IrbCVcYXVtMvlfE75nM-UbJXA",
  authDomain: "weightlifting-333222.firebaseapp.com",
  projectId: "weightlifting-333222",
  storageBucket: "weightlifting-333222.appspot.com",
  messagingSenderId: "1043715347799",
  appId: "1:1043715347799:web:f1838726ad800d9c341a12",
  measurementId: "G-J87TRX6H7N"
};

initializeApp(firebaseConfig);

const deleteMedia = (db, item) => {
  deleteMediaItemFirebase(db, item)
}

const renderMediaItem = (type, url) => {
  if (type.includes('video')) {
    return (
      <video key={url} width="320" height="240" autoPlay muted controls style={{ display: 'block' }}>
        <source src={url} type="video/mp4" />
        <source src={url} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    )
  } else {
    return (
      <img src={url} alt="to add description" width="320" height="240" />
    )
  }
}

const groupByDate = (array = []) => {
  return array.reduce((result, currentItem) => {
    (
      result[timestampToDate(currentItem.timestamp)] =
      result[timestampToDate(currentItem.timestamp)] || [])
    .push(currentItem);
    return result;
  }, {});
};


function App() {
  const db = getFirestore();
  const { data: media, isLoading: isLoadingMedia } = useQuery('media', () => getMediaFirebase(db))
  const groupedMedia = groupByDate(media);
  const [showFilter, setShowFilter] = useState(false)

  const [selectedBasicTags, setSelectedBasicTags] = useState([]);
  const [selectedAdvancedTags, setSelectedAdvancedTags] = useState([])

  const shouldShowMedia = (tags) => {
    if (showFilter) {
      return tags.some(tag => selectedBasicTags.includes(tag)) && selectedAdvancedTags.every(element => tags.includes(element))
    }
    return true
  }

  // useEffect(() => {
  //   if (globalTags)
  //     setSelectedAnyTags(globalTags.map(t => t.name))
  // }, [globalTags])

  if (isLoadingMedia) {
    return <div> loading </div>
  }

  return (
    <main style={{ padding: "1rem 0" }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setShowFilter(!showFilter)}>
          {!showFilter ? 
          <>
            <span>
              Filter
            </span>
            <AiOutlineFilter size={20} />
          </> : 
          <>
            <span>
              Close
            </span>
          </>}
        </button>


        </div>
        {showFilter && <FilterComponent
          selectedBasicTags={selectedBasicTags}
          setSelectedBasicTags={setSelectedBasicTags}
          selectedAdvancedTags={selectedAdvancedTags}
          setSelectedAdvancedTags={setSelectedAdvancedTags}
        />}
      </div>

      {Object.entries(groupedMedia).map((entry) => {
        const date = entry[0];
        const mediaArray = entry[1];
        console.log('mediaArray is', mediaArray);
        return <div>
          {date}
          {mediaArray.map((item) => {
            return shouldShowMedia(item.tags) &&
              <div key={item.url} style={{ border: '2px solid pink', margin: '10px 0', display: 'flex' }}>
                {renderMediaItem(item.type, item.url)}
                <TagsInput tags={item.tags} id={item.id} />
                <button onClick={() => deleteMedia(db, item)}> Delete item </button>
              </div>
          })}
        </div>
      })}
    </main>
  );
}

export default App;
