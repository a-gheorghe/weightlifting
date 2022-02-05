import { collection, getDocs, orderBy, query, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 


// get all media
export const getMediaFirebase = async (db) => {
    const q = query(collection(db, "media"), orderBy("timestamp", "desc"));

    
    const querySnapshot = await getDocs(q)

    const media = [];
    querySnapshot.forEach((doc) => {
      media.push({...doc.data(), mediaId: doc.id });
    });
    return media;
  }

export const addTagFirebase = async(db, mediaId, tag) => {
    console.log('tag is', tag);
    console.log('mediaId is', mediaId);
    const mediaRef = doc(db, "media", mediaId);

    await updateDoc(mediaRef, {
        // tags: arrayUnion(tag)

        tags: arrayUnion(tag)
    });
}

export const removeTagFirebase = async(db, mediaId, tag) => {
    const mediaRef = doc(db, "media", mediaId);

    await updateDoc(mediaRef, {
        // tags: arrayUnion(tag)

        tags: arrayRemove(tag)
    });
}



