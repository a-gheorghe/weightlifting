import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import DatePicker from 'react-datepicker';
import { setDoc, doc, Timestamp, getFirestore } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';

const StyledPage = styled.div`
  background-color: #F2F6FD;
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
`
export default function AddMedia() {
  const storage = getStorage();
  const db = getFirestore();
  const [startDate, setStartDate] = useState(new Date());
  const [media, setMedia] = useState([]);

  const changeHandler = (event) => {
    let files = event.target.files;
    let reader;

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file.type.includes('video')) {
        let blobURL = URL.createObjectURL(file);
        media[i] = { file: file, preview: blobURL, progress: 0 };
        setMedia([...media])
      } else {
        reader = new FileReader();
        reader.readAsDataURL(file);       
        reader.onload = event => {
        media[i] = { file: file, preview: event.target.result, progress: 0 };
        setMedia([...media]);
        }
      }
  }
}

const doneUploading = media.length > 0 && media.every(item => item.progress === 100)

const addDocument = async(uploadTask, type, id) => {


  const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
  const newDoc = await setDoc(doc(db, 'media', id), {
    url: downloadUrl,
    timestamp: Timestamp.fromDate(startDate),
    type,
    tags: ['No tag'],
  })
  console.log('DONE!', newDoc);
}

const uploadMedia = () => {
  media.forEach((item) => {
    const id = uuid();
    const file = item.file;
    const fileRef = ref(storage, id)
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const index = media.findIndex(existingMedia => {
          return existingMedia.file.name === file.name
        });
        media[index] = { ...media[index], progress };
        setMedia([...media])
      },
      (error) => {
        console.log('cannot upload', error);
      },
      () => addDocument(uploadTask, item.file.type, id)
      
  )
});
}

    return (
        <StyledPage>
          <div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <input type="file" multiple accept="video/mp4, video/x-m4v, video/*, image/*" onChange={changeHandler} />
            <div>
              {media.map(item => {
                if (item.file.type.includes('video')) {
                  return (
                    <div key={item.preview}>
                      <video width="100" height="100" autoPlay muted controls style={{ display: 'block' }}>
                        <source src={`${item.preview}`} type="video/mp4" />
                        <source src={`${item.preview}`} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                      <div>{item.progress}</div>
                    </div>
                  )
                }
                return (
                  <div key={item.preview}>
                    <div style={{ margin: '10px 0' }}>
                      <img src={item.preview} alt="Preview" height={100} width={100} />
                    </div>
                    <div>{item.progress}</div>
                  </div>
                )
              })}

              <button onClick={uploadMedia} style={{ backgroundColor: 'blue', color: 'white' }}> Upload media </button>
              {doneUploading && 
              
              <div>
                Done uploading! 
              </div>}
        </div>
          </div>
        </StyledPage>
    )
}