import { useState } from 'react';
import DatePicker from 'react-datepicker';
// import Dropzone from '../Dropzone'; 
// import { addDoc, collection, Timestamp, getFirestore } from 'firebase/firestore';
// import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
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
    const [startDate, setStartDate] = useState(new Date());
    const [preview, setPreview] = useState([]); // empty array initially

    console.log('preview is', preview);

    // const [files, setFiles] = useState([]);
    // const storage = getStorage();
    // const db = getFirestore();


    // const dropzoneCallback = async(acceptedFiles) => {
    //   console.log('accepted files are', acceptedFiles);
    //   setFiles(acceptedFiles);

    //     acceptedFiles.forEach((file) => {
    //         const fileRef = ref(storage, `${file.name}-${Date.now()}`)
    //         const uploadTask = uploadBytesResumable(fileRef, file);

    //     uploadTask.on('state_changed', 
    //       (snapshot) => {
    //         console.log('state changed', file);
    //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         const existingFileIndex = files.indexOf(existingFile => existingFile.name === file.name)
    //         console.log('existing file index', existingFileIndex, file.name);
    //         if (existingFileIndex > -1) {
    //           const updatedFile = {...files[existingFileIndex], progress }
    //           const updatedFiles = files.splice(existingFileIndex, 1, updatedFile);
    //           console.log('exists: updated files are', updatedFiles)
    //           setFiles(updatedFiles)
    //         } else {
    //           const updatedFiles = [...files, { name: file.name, progress }]
    //           console.log('does not exist: updated files are', updatedFiles)
    //           setFiles(updatedFiles)
    //         }

            
    //         console.log('Upload is ' + progress + '% done');
    //       }, 
    //       (error) => {
    //         console.log('cannot upload', error);
    //       }, 
    //       async () => {
    //         const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    //         const existingFileIndex = files.indexOf(existingFile => existingFile.name === file.name);
    //         const updatedFile = {...files[existingFileIndex], url: downloadUrl }
    //         const updatedFiles = files.splice(existingFileIndex, 1, updatedFile);
    //         setFiles(updatedFiles);

    //         const newDoc = await addDoc(collection(db, "videos"), {
    //             url: downloadUrl,
    //             timestamp: Timestamp.fromDate(startDate)
    //         })
    //         console.log('DONE!', newDoc)
    //       }
    //     );
    //     })  
    //   };

    //   const onSubmit = () => {
    //     console.log('files on submit are', files);
    //   }


    const changeHandler = (event) => {
      let files = event.target.files;
      let reader;

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        console.log('file is', file);
        if (file.type.includes('video')) {
          let blobURL = URL.createObjectURL(file);
          preview[i] = { type: 'video', preview: blobURL };
          setPreview([...preview])
        } else {
          reader = new FileReader();
          reader.readAsDataURL(file);       
          reader.onload = event => {
            // update the array instead of replacing the entire value of preview
            preview[i] = { type: 'image', preview: event.target.result };
            setPreview([...preview]); // spread into a new array to trigger rerender
          }
        }
    }
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
              {preview.map(item => {
                if (item.type === 'video') {
                  return (
                    <video key={item.preview} width="100" height="100" autoPlay muted controls style={{ display: 'block' }}>
                      <source src={`${item.preview}`} type="video/mp4" />
                      <source src={`${item.preview}`} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  )
                }
                return (
                  <div style={{ margin: '10px 0' }}>
                    <img src={item} alt="Preview" height={100} width={100} />
                  </div>
                )
              })}
        </div>
          </div>
          {/* <MockModal>
            <Dropzone
              dropzoneCallback={dropzoneCallback}
              startDate={startDate}
            />

            <div>
              {files.map((file) => {
                return (
                  <div> {file.name} progress is {file.progress} </div>
                )
              })}
            </div>
            <button onClick={onSubmit}> Submit </button>
          </MockModal> */}
        </StyledPage>
    )
}