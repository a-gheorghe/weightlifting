import { useState } from 'react';
import DatePicker from 'react-datepicker';
// import Dropzone from '../Dropzone'; 
import { addDoc, collection, Timestamp, getFirestore } from 'firebase/firestore';
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

// const MockModal = styled.div`
//   background-color: white;
//   border-radius: 30px;
//   width: 400px;
//   height: fit-content;
//   padding: 30px;
// `;

// const DatePickerWrapper = styled.div`
//   height: fit-content;
//   display: flex;
//   align-items: flex-end;
//   margin: 0 30px 15px 0px;
//   & .react-datepicker__input-container {
//     display: inline-flex;
//     justify-content: flex-end;
//     margin-bottom: 20px;
//   }
// `;

// const CustomInput = styled.input`
//   border-left: 0;
//   border-top: 0;
//   border-right: 0;
//   border-width: 2px;
//   border-color: #A9CCFF;
// `;

export default function AddMedia() {
    const storage = getStorage();
    const [startDate, setStartDate] = useState(new Date());
    const [media, setMedia] = useState([]); // empty array initially

    console.log('media is', media);
    const db = getFirestore();



    const changeHandler = (event) => {
      console.log('event.target.files', event.target.files);
      let files = event.target.files;
      let reader;

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        console.log('file is', file);
        if (file.type.includes('video')) {
          let blobURL = URL.createObjectURL(file);
          media[i] = { file: file, preview: blobURL, progress: 0 };
          setMedia([...media])
        } else {
          reader = new FileReader();
          reader.readAsDataURL(file);       
          reader.onload = event => {
            // update the array instead of replacing the entire value of preview
            media[i] = { file: file, preview: event.target.result, progress: 0 };
            setMedia([...media]); // spread into a new array to trigger rerender
          }
        }
    }
  }

  const addDocument = async(uploadTask, type) => {
    console.log('adding document');
                 const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  // const index = media.indexOf(existingMedia => existingMedia.file.name === file.name);
                  // media[index] = { ...media[index], url: downloadUrl };
                  // setMedia([...media])
                  const newDoc = await addDoc(collection(db, 'media'), {
                    url: downloadUrl,
                    timestamp: Timestamp.fromDate(startDate),
                    type,
                  })
                  console.log('DONE!', newDoc);
  }

  const uploadMedia = () => {
    console.log('media are', media)

    media.forEach((item) => {
      const file = item.file;
      const fileRef = ref(storage, `${file.name}-${Date.now()}`)
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
        () => addDocument(uploadTask, item.file.type)
       
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
                console.log('item inside map', item);
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
        </div>
          </div>
        </StyledPage>
    )
}