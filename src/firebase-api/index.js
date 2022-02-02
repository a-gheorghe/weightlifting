import { collection, getDocs, query, where } from "firebase/firestore"; 


// get all videos
export const getVideos = async (db) => {
    const querySnapshot = await getDocs(collection(db, "videos"))
    const videos = [];
    querySnapshot.forEach((doc) => {
      videos.push(doc.data());
    });
    return videos;
  }
// add videos by choosing day

// get videos for a specific year
export const getVideosByYear = async (db, year) => {
    const q = query(collection(db, "videos"), where("year", "==", `${year}`));
    const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});


const videos = [];
querySnapshot.forEach((doc) => {
    videos.push(doc.data());
});
return videos
}



// get videos for a specific month
export const getVideosByMonth = async (db, year, month) => {
    console.log('getVideosByMonth')
    const q = query(collection(db, "videos"), where("year", "==", `${year}`), where("month", "==", `${month}`));
    const querySnapshot = await getDocs(q);
    const videos = [];
    querySnapshot.forEach((doc) => {
        console.log('inside doc', doc.data())
        videos.push(doc.data());
    });
    return videos
}

// get videos for a specific day
export const getVideosByDay = async (db, year, month, day) => {
    const q = query(collection(db, "videos"), where("year", "==", year), where("month", "==", month), where("day", "==", day));

const querySnapshot = await getDocs(q);
const videos = [];
querySnapshot.forEach((doc) => {
    videos.push(doc.data());
});
return videos
}

// get videos with a certain tag

// add tag(s) to video

// remove tag(s) from video



