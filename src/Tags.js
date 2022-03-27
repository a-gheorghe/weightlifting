import React from "react";

export const Tags = ({ onAdd, onRemove, tags, onChange, value, isAdmin }) => {
  const onKeyDown = async (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      onAdd();
    }
  };

  const onRemoveTagClick = (tag) => {
    onRemove(tag);
  };

  return (
    <div>
      <div> Tags</div>
      {isAdmin && (
        <input value={value} onChange={onChange} onKeyDown={onKeyDown} />
      )}
      {tags.map((tag) => {
        return (
          <div key={tag}>
            <span style={{ margin: "0 5px", backgroundColor: "lightblue" }}>
              {tag}
            </span>
            {isAdmin && (
              <button onClick={() => onRemoveTagClick(tag)}>Remove</button>
            )}
          </div>
        );
      })}
    </div>
  );
};
