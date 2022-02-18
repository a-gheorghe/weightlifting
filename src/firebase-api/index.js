import { collection, getDocs, deleteDoc, orderBy, query, doc, updateDoc, setDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore"; 
import { getStorage, ref, deleteObject } from 'firebase/storage';

export const getMediaFirebase = async (db) => {
    const q = query(collection(db, "media"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q)
    const media = [];
    querySnapshot.forEach((doc) => {
      media.push({...doc.data(), id: doc.id });
    });
    return media;
  }

export const deleteMediaItemFirebase = async (db, item) => {
    console.log('item is', item);
    // delete the doc
    await deleteDoc(doc(db, "media", item.id));
    // remove the global tags
    item.tags.forEach(async tag => {
        return await removeGlobalTagFirebase(db, tag)
    })
    // remove the media from storage
    const storage = getStorage();
    const mediaRef = ref(storage, item.id);
    await deleteObject(mediaRef);

}

  export const getGlobalTagsFirebase = async (db) => {
    const q = query(collection(db, "tags"));
    const querySnapshot = await getDocs(q)
    const globalTags = [];
    querySnapshot.forEach((doc) => {
      globalTags.push(doc.data());
    });
    return globalTags; 
  }

export const addTagFirebase = async(db, id, tag) => {
    const mediaRef = doc(db, "media", id);
    await updateDoc(mediaRef, {
        tags: arrayUnion(tag)
    });
}

export const removeTagFirebase = async(db, id, tag) => {
    const mediaRef = doc(db, "media", id);
    await updateDoc(mediaRef, {
        tags: arrayRemove(tag)
    });
}

export const addGlobalTagFirebase = async(db, type, tag) => {
    const tagRef = doc(db, "tags", tag);
    const tagDoc = await getDoc(tagRef);
    
    if (tagDoc.exists()) {
        const existingData = tagDoc.data();
        await updateDoc(tagRef, {
          amount: existingData.amount + 1
      })
    } else {
      await setDoc(doc(db, "tags", tag), {
        name: tag,
        type: type,
        amount: 1
    });
    }
}

export const removeGlobalTagFirebase = async(db, tag) => {
    const tagRef = doc(db, "tags", tag);
    const tagDoc = await getDoc(tagRef);

    const existingData = tagDoc.data();

    // if this is the last instance of the tag, we want to delete the document
    if (existingData.amount === 1) {
        await deleteDoc(tagRef);
    } else {
        await updateDoc(tagRef, {
            amount: existingData.amount - 1
        })
    }
}

