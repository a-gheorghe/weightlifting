import { collection, getDocs } from "firebase/firestore"; 


// get all media
export const getMedia = async (db) => {
    const querySnapshot = await getDocs(collection(db, "media"))
    const media = [];
    querySnapshot.forEach((doc) => {
      media.push(doc.data());
    });
    return media;
  }



