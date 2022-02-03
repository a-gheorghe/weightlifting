import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getMedia } from './firebase-api';
import {
  useQuery,
} from 'react-query'
import { timestampToDate } from "./utils";


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

const isVideo = (media) => media.type.includes('video');
const isImage = (media) => media.type.includes('image');


function App() {
  const db = getFirestore();
  const { data  } = useQuery('media', () => getMedia(db))  

  

    return (
      <main style={{ padding: "1rem 0" }}>
        {data && data.map((media) => {
          console.log('media item is', media);
          console.log('isVideo', isVideo(media));
          console.log('isImage', isImage(media));
            return (
              <div key={media.url}>
                <div>{timestampToDate(media.timestamp)}</div>
                {isVideo(media) && renderVideo(media.url)}
                {isImage(media) && renderImage(media.url)}
              </div>
            )
          })}
      </main>
    );
}

export default App;
