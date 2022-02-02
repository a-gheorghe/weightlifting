import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import Overview from './routes/Overview';
import { getVideos } from './firebase-api';
import {
  useQuery,
} from 'react-query'
import { timestampToYear, timestampToMonth, timestampToDay } from "./utils";


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
const db = getFirestore();


function App() {
  const query = useQuery('videos', () => getVideos(db))

  console.log('query.data', query.data);
  if (query.data) {
    const timestamp = query.data[0].timestamp
    console.log('year', timestampToYear(timestamp))
    console.log('month', timestampToMonth(timestamp))
    console.log('day', timestampToDay(timestamp))
  }
  return (
    <div>
      <Overview /> 
    </div>
  );
}

export default App;
