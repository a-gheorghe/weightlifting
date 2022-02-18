import { useState } from 'react';
import { getFirestore } from "firebase/firestore";
import {
    useMutation,
    useQueryClient
  } from 'react-query'
import { addTagFirebase, removeTagFirebase, addGlobalTagFirebase, removeGlobalTagFirebase } from './firebase-api';


export const TagsInput = ({ id, tags }) => {
    const db = getFirestore();
    const [inputValue, setInputValue] = useState('');
    const queryClient = useQueryClient()

    
    const addTag = useMutation(
        tag => addTagFirebase(db, id, tag),
        {
            onSuccess: () => {
              queryClient.invalidateQueries(['media'])
            },
          }
      )
    const addGlobalTag = useMutation(
        tag => addGlobalTagFirebase(db, 'media', tag),
        {
            onSuccess: () => {
              queryClient.invalidateQueries(['globalTags'])
            },
          }
    );

    const removeGlobalTag = useMutation(
        tag => removeGlobalTagFirebase(db, tag),
        {
            onSuccess: () => {
              queryClient.invalidateQueries(['globalTags'])
            },
          }
    );

    const removeTag = useMutation(
        tag => removeTagFirebase(db, id, tag),
        {
            onSuccess: () => {
              queryClient.invalidateQueries(['media'])
            },
          }
    )

    const onKeyDown = async(e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (!tags.includes(inputValue)) {
                addTag.mutate(inputValue)
                addGlobalTag.mutate(inputValue)
            }
            setInputValue('');
        } 
    }

    const onRemoveTagClick = (tag) => {
        removeTag.mutate(tag)
        removeGlobalTag.mutate(tag)
    }

    return (
        <div>
            <div> Tags</div>
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={onKeyDown}/>
            {tags.map(tag => {
                return ( 
                    <div key={tag}>
                        <span style={{ margin: '0 5px', backgroundColor: 'lightblue', }}>
                            {tag}
                        </span>
                        <button onClick={() => onRemoveTagClick(tag)}>Remove</button>
                    </div>
                )
            })}
        </div>

    )
}