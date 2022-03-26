import React, { useEffect, useState } from "react";
import ReactSelect, { components } from "react-select";
import { useQuery } from "react-query";

import { getAllTagsFirebase } from "./firebase-api";
import { getFirestore } from "firebase/firestore";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export const FilterComponent = ({
  basicTags,
  setBasicTags,
  advancedTags,
  setAdvancedTags,
}) => {
  const db = getFirestore();
  const { data } = useQuery("tags", () => getAllTagsFirebase(db));
  const options = (data || []).map((tag) => ({
    label: tag,
    value: tag,
  }));

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  useEffect(() => {
    setBasicTags((data || []).map((data) => data));
  }, [data, setBasicTags]);

  return (
    <>
      <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
        {!showAdvancedOptions
          ? "Show advanced options"
          : "Hide advanced options"}
      </button>
      <div>Show media that have ANY of these tags:</div>
      <ReactSelect
        options={options}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{
          Option,
        }}
        onChange={(target) => setBasicTags(target.map((t) => t.value))}
        allowSelectAll={true}
        value={basicTags.map((tag) => ({ label: tag, value: tag }))}
        hasValue={false}
        isOptionDisabled={(option) => advancedTags.includes(option.value)}
      />

      {showAdvancedOptions && (
        <>
          <div>Media must also contain these tags:</div>
          <ReactSelect
            options={options}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{
              Option,
            }}
            onChange={(target) => setAdvancedTags(target.map((t) => t.value))}
            allowSelectAll={true}
            value={advancedTags.map((tag) => ({ label: tag, value: tag }))}
            isOptionDisabled={(option) => basicTags.includes(option.value)}
          />
        </>
      )}
    </>
  );
};
