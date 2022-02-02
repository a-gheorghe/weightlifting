import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { getVideosByDay } from '../firebase-api';

export default function Day() {
  const db = getFirestore();
  let { year, month , day } = useParams();
  const { data } = useQuery('videos', () => getVideosByDay(db, year, month, day))
  

    // get all the videos for this day and displaying them. Also a button to add videos to this day
    return (
      <main style={{ padding: "1rem 0" }}>
        <button> Previous day</button>
        <h2>{month} {day} {year}</h2>
        {data && data.map((video) => {
          return (
            <div>
              <video width="320" height="240" autoPlay muted controls>
                <source src={`${video.url}`} type="video/mp4" />
                <source src={`${video.url}`} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
          )
        })
        }
      <button> Next day</button>
      </main>
    );
  }