import React, { useMemo } from 'react';
import {useDropzone} from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: '20px',
  borderColor: '#A9CCFF',
  borderStyle: 'dashed',
  backgroundColor: '#FBFCFD',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  margin: '0 30px',
};

const activeStyle = {
  borderColor: '#A9CCFF'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function Dropzone({ dropzoneCallback, startDate }) {

  const onDrop = acceptedFiles => {
    return dropzoneCallback(acceptedFiles)
}

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({accept: 'image/*, video/*', onDrop });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);


  return (
    <section>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {/* {files.map((file) => <VideoPreview file={file} />)} */}
    </section>
    );
}

export default Dropzone;