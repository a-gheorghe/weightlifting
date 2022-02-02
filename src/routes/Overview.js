import React from 'react';
import { useQuery } from 'react-query';
import { getFirestore } from 'firebase/firestore';
import { getVideos } from '../firebase-api';
import { timestampToYear } from '../utils';

export default function Overview() {
  const db = getFirestore();
  const { data } = useQuery('videos', () => getVideos(db))

  let sortedVideos = {};
  if (data) {
    data.forEach((video) => {
        const year = timestampToYear(video.timestamp)
        if (Object.keys(sortedVideos).includes(year)) {
            sortedVideos[year] = [...sortedVideos[year], video]
        } else {
            sortedVideos[year] = [video]
        }
    })
  }
  
  console.log('sortedVideos', sortedVideos);
  

    // get all the videos for this day and displaying them. Also a button to add videos to this day
    return (
      <main style={{ padding: "1rem 0" }}>
        {Object.entries(sortedVideos).map((item) => {
          const year = item[0];
          const videos = item[1];
          return (
            <div>
            <div>{year}</div>
            {videos.map(video => {
              return (
                <video width="320" height="240" autoPlay muted controls style={{ display: 'block' }}>
                  <source src={`${video.url}`} type="video/mp4" />
                  <source src={`${video.url}`} type="video/ogg" />
                  Your browser does not support the video tag.
              </video>
              )
            })}
          </div>
        )
      })
    }
      </main>
    );
  }