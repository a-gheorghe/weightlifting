import { collection, getDocs, orderBy, query } from "firebase/firestore"; 


// get all media
export const getMedia = async (db) => {
    const q = query(collection(db, "media"), orderBy("timestamp", "desc"));

    
    const querySnapshot = await getDocs(q)

    const media = [];
    querySnapshot.forEach((doc) => {
      media.push(doc.data());
    });
    return media;
  }



