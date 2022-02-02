import { useContext } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { Link } from "react-router-dom";
import Folder from './Folder';
import Overview from './routes/Overview';
import { getVideos } from './firebase-api';
import {
  useQuery,
} from 'react-query'
import { timestampToYear, timestampToMonth, timestampToDay, isAdmin } from "./utils";
import { UserContext } from './UserContext';


const firebaseConfig = {
  apiKey: "AIzaSyALCegZh1IrbCVcYXVtMvlfE75nM-UbJXA",
  authDomain: "weightlifting-333222.firebaseapp.com",
  projectId: "weightlifting-333222",
  storageBucket: "weightlifting-333222.appspot.com",
  messagingSenderId: "1043715347799",
  appId: "1:1043715347799:web:f1838726ad800d9c341a12",
  measurementId: "G-J87TRX6H7N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();


function App() {
  const { user } = useContext(UserContext);
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
