import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';
import { VideoPreview } from './VideoPreview';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


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

const StyledSection = styled.section`
  background-color: #F2F6FD;
  min-height: calc(100vh - 64px);
`

function Dropzone({ dropzoneCallback, startDate }) {

  const onDrop = acceptedFiles => {
    return dropzoneCallback(acceptedFiles)
}


  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
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