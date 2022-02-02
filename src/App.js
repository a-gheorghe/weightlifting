import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getVideos } from './firebase-api';
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


function App() {
  const db = getFirestore();
  const { data  } = useQuery('videos', () => getVideos(db))  

    return (
      <main style={{ padding: "1rem 0" }}>
        {data && data.map((video => {
          return (
            <>
            <div>{timestampToDate(video.timestamp)}</div>
            <video key={video.url} width="320" height="240" autoPlay muted controls style={{ display: 'block' }}>
              <source src={`${video.url}`} type="video/mp4" />
              <source src={`${video.url}`} type="video/ogg" />
              Your browser does not support the video tag.
          </video>
          </>
         )
        }))}
      </main>
    );
}

export default App;
