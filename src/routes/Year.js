import React from 'react'
import { getFirestore } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { getVideosByYear } from '../firebase-api';
import { useQuery } from 'react-query';

export default function Year() {
  const db = getFirestore();

  let { year } = useParams();
  const query = useQuery('videos', () => getVideosByYear(db, year))
  console.log('query.data in year is', query.data);

    // get all the day folders for this month
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Year: {year} </h2>
        
      </main>
    );
  }