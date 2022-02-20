import { useState } from 'react';
import ReactSelect, { components } from "react-select";
import {
    useQuery,
  } from 'react-query';

import { getGlobalTagsFirebase } from './firebase-api';
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

export const FilterComponent = ({ selectedBasicTags, setSelectedBasicTags, selectedAdvancedTags, setSelectedAdvancedTags }) => {
  const db = getFirestore();
  const { data } = useQuery('globalTags', () => getGlobalTagsFirebase(db))
  console.log('data is', data);
  const options = (data || [])
  .map((tag) => ({
      label: tag.name,
      value: tag.name
    }))

    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    return (
    <>
      <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
        {!showAdvancedOptions
          ? "Show advanced options"
          : "Hide advanced options"}
      </button>
      <div>
        Show media that have ANY of these tags:
      </div>
      <ReactSelect
        options={options}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{
          Option
        }}
        onChange={(target) => setSelectedBasicTags(target.map((t) => t.value))}
        allowSelectAll={true}
        value={selectedBasicTags.map((tag) => ({ label: tag, value: tag }))}
        hasValue={false}
        isOptionDisabled={(option) => selectedAdvancedTags.includes(option.value)}
      />

{showAdvancedOptions &&
  <> 
    <div>Media must also contain these tags:</div>
    <ReactSelect
      options={options}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{
        Option
      }}
      onChange={(target) => setSelectedAdvancedTags(target.map((t) => t.value))}
      allowSelectAll={true}
      value={selectedAdvancedTags.map((tag) => ({ label: tag, value: tag }))}
      isOptionDisabled={(option) => selectedBasicTags.includes(option.value)}
    />
  </>
      }
    
    </>
  )
}