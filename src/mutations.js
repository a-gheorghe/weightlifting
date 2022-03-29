import { useMutation, queryClient } from "react-query";
import {
  deleteMediaItemFirebase,
  removeTagMediaItemFirebase,
  addTagMediaItemFirebase,
} from "./firebase-api";

export const deleteMedia = useMutation(
  ({ db, item }) => deleteMediaItemFirebase(db, item),
  {
    onSuccess: () => {
      queryClient.invalidateQueries("media");
    },
  }
);

export const removeTag = useMutation(
  ({ db, item, tag }) => removeTagMediaItemFirebase(db, item, tag),
  {
    onSuccess: () => {
      queryClient.invalidateQueries("media");
    },
  }
);

export const addTag = useMutation(
  ({ db, item, tag }) => addTagMediaItemFirebase(db, item, tag),
  {
    onSuccess: () => {
      queryClient.invalidateQueries("media");
    },
  }
);
