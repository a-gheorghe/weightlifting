import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getMediaFirebase } from './firebase-api';
import {
  useQuery,
} from 'react-query'
import { timestampToDate } from "./utils";
import { TagsInput } from './TagsInput';


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

const renderImage = (url) => {
  return (
    <img src={url} alt="to add description" width="320" height="240" />
  )
}

const renderVideo = (url) => {
  return (
    <video key={url} width="320" height="240" autoPlay muted controls style={{ display: 'block' }}>
      <source src={url} type="video/mp4" />
      <source src={url} type="video/ogg" />
      Your browser does not support the video tag.
    </video>
  )
}

const isVideo = (type) => type.includes('video');
const isImage = (type) => type.includes('image');

const groupByDate = (array = []) => {
  return array.reduce((result, currentItem) => {(
    result[timestampToDate(currentItem.timestamp)] = 
      result[timestampToDate(currentItem.timestamp)] || [])
      .push(currentItem);
    return result;
  }, {});
};


function App() {
  const db = getFirestore();
  const { data  } = useQuery('media', () => getMediaFirebase(db))  
  const grouped = groupByDate(data);

  console.log('grouped is', grouped);

    return (
      <main style={{ padding: "1rem 0" }}>
        {grouped && Object.entries(grouped).map((entry) => {
                  const date = entry[0];
                  const mediaArray = entry[1];
                  return (
                    <>
                      <div><strong>{date}</strong></div>
                      {mediaArray.map((media) => {
                        const { url, type, tags, mediaId } = media
                        return (
                          <div key={url} style={{ border: '2px solid pink', margin: '10px 0', display: 'flex' }}>
                            {isVideo(type) && renderVideo(url)}
                            {isImage(type) && renderImage(url)}
                            <TagsInput tags={tags} mediaId={mediaId} />
                          </div>
                        )
                      })}
                    </>
                  )})}

      </main>
    );
}

export default App;
