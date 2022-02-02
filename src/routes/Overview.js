import React from 'react';
import { useQuery } from 'react-query';
import { getFirestore } from 'firebase/firestore';
import { getVideos } from '../firebase-api';
import { timestampToDate } from '../utils';

export default function Overview() {
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