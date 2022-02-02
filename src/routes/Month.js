import React, { useContext } from 'react'
import { getFirestore } from 'firebase/firestore';
import Folder from "../Folder";
import { Link, useParams } from 'react-router-dom';
import { isAdmin } from '../utils';
import { UserContext } from "../UserContext";
import { getVideosByMonth } from '../firebase-api';
import { useQuery } from 'react-query';

export default function Month() {
  const db = getFirestore();

  let { year, month } = useParams();
  const { data } = useQuery('videos', () => getVideosByMonth(db, year, month))
  const sortedVideos = data.sort((v1, v2) => v1.day - v2.day);
  console.log('sortedVideos', sortedVideos);
  const uniqueDays = [...new Set(sortedVideos.map(video => video.day))]
  console.log('uniqueDays', uniqueDays);
  let uniqueSortedDays = [];
  if (data) {
    uniqueSortedDays = [...new Set(data.sort((a, b) => a.day - b.day))]
  }

  console.log('uniqueSortedDays are', uniqueSortedDays);



    // get all the day folders for this month
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>{month}</h2>
        {uniqueDays
.map((day => {
          return (
            <Link to={`${day}`}><Folder>{day}</Folder></Link>
          )
        }))}
      </main>
    );
  }