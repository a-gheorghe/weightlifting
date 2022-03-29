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
  where,
} from "firebase/firestore";
import dayjs from "dayjs";

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

export const getMediaDayFirebase = async (db, date) => {
  console.log("date is", date);
  const q = query(
    collection(db, "media"),
    where("timestamp", "==", dayjs(date).unix())
  );
  const querySnapshot = await getDocs(q);
  const media = [];
  querySnapshot.forEach((doc) => {
    media.push({ ...doc.data(), id: doc.id });
  });
  return media;
};

export const getMediaMonthFirebase = async (db, date) => {
  const startOfMonth = dayjs(date).startOf("month").unix();
  const endOfMonth = dayjs(date).endOf("month").unix();
  const q = query(
    collection(db, "media"),
    where("timestamp", ">=", startOfMonth),
    where("timestamp", "<=", endOfMonth)
  );
  const querySnapshot = await getDocs(q);
  const media = [];
  querySnapshot.forEach((doc) => {
    media.push({ ...doc.data(), id: doc.id });
  });
  return media;
};

export const removeTagMediaItemFirebase = async (db, item, tag) => {
  const mediaRef = doc(db, "media", item.id);
  await updateDoc(mediaRef, {
    tags: arrayRemove(tag),
  });
};

export const addTagMediaItemFirebase = async (db, item, addedTag) => {
  const mediaRef = doc(db, "media", item.id);
  await updateDoc(mediaRef, {
    tags: arrayUnion(addedTag),
  });
};

export const deleteMediaItemFirebase = async (db, item) => {
  // delete the doc
  await deleteDoc(doc(db, "media", item.id));
  // remove the media from storage
  const storage = getStorage();
  const mediaRef = ref(storage, item.id);
  await deleteObject(mediaRef);
};

export const addMediaItemsFirebase = async (db, items) => {
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
