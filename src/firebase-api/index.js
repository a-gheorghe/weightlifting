import {
  collection,
  getDocs,
  deleteDoc,
  orderBy,
  query,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

export const getMediaFirebase = async (db) => {
  const q = query(collection(db, "media"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  const media = [];
  querySnapshot.forEach((doc) => {
    media.push({ ...doc.data(), id: doc.id });
  });
  return media;
};

export const deleteMediaItemFirebase = async (db, item) => {
  // console.log('db is', db);
  // console.log('item is', item);
  // delete the doc
  await deleteDoc(doc(db, "media", item.id));
  // remove the media from storage
  const storage = getStorage();
  const mediaRef = ref(storage, item.id);
  await deleteObject(mediaRef);
};

export const addMediaItemsFirebase = async (db, items) => {
  console.log("inside the api", items);
  const batch = writeBatch(db);
  items.forEach(async (item) => {
    const ref = doc(db, "media", item.id);
    batch.set(ref, item);
  });
  await batch.commit();
};

export const getAllTagsFirebase = async (db) => {
  const q = query(collection(db, "media"));
  const querySnapshot = await getDocs(q);
  const tags = [];
  querySnapshot.forEach((doc) => {
    tags.push(doc.data().tags);
  });
  return [...new Set(tags.flat())];
};

export const addTagFirebase = async (db, id, tag) => {
  const mediaRef = doc(db, "media", id);
  await updateDoc(mediaRef, {
    tags: arrayUnion(tag),
  });
};

export const removeTagFirebase = async (db, id, tag) => {
  const mediaRef = doc(db, "media", id);
  await updateDoc(mediaRef, {
    tags: arrayRemove(tag),
  });
};
