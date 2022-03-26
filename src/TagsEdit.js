import React, { useState } from "react";
import { getFirestore } from "firebase/firestore";
import { useMutation, useQueryClient } from "react-query";
import { addTagFirebase, removeTagFirebase } from "./firebase-api";

export const TagsEdit = ({ id, tags, onEnter }) => {
  const db = getFirestore();
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();

  const addTag = useMutation((tag) => addTagFirebase(db, id, tag), {
    onSuccess: () => {
      queryClient.invalidateQueries(["media"]);
    },
  });

  const removeTag = useMutation((tag) => removeTagFirebase(db, id, tag), {
    onSuccess: () => {
      queryClient.invalidateQueries(["media"]);
    },
  });

  const onKeyDown = async (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (!tags.includes(inputValue)) {
        if (onEnter) {
          onEnter();
        } else {
          addTag.mutate(inputValue);
        }
      }
      setInputValue("");
    }
  };

  const onRemoveTagClick = (tag) => {
    removeTag.mutate(tag);
  };

  return (
    <div>
      <div> Tags</div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {tags.map((tag) => {
        return (
          <div key={tag}>
            <span style={{ margin: "0 5px", backgroundColor: "lightblue" }}>
              {tag}
            </span>
            <button onClick={() => onRemoveTagClick(tag)}>Remove</button>
          </div>
        );
      })}
    </div>
  );
};
