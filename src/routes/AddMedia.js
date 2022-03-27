import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import { Timestamp, getFirestore } from "firebase/firestore";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useMutation } from "react-query";
import { addMediaItemsFirebase } from "../firebase-api";
import { Tags } from "../Tags";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const StyledPage = styled.div`
  background-color: #f2f6fd;
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default function AddMedia() {
  const navigate = useNavigate();
  const storage = getStorage();
  const db = getFirestore();
  const [startDate, setStartDate] = useState(new Date());
  const [media, setMedia] = useState([]);

  const { mutate } = useMutation((items) => addMediaItemsFirebase(db, items), {
    onSuccess: () => {
      navigate("/");
    },
  });

  const readAsDataURL = (file) => {
    return new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = function () {
        return resolve({
          data: fileReader.result,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      };
      fileReader.readAsDataURL(file);
    });
  };

  const changeHandler = async (event) => {
    let files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const id = uuid();
      let file = files[i];
      let preview;
      if (file.type.includes("video")) {
        preview = URL.createObjectURL(file);
      } else {
        const result = await readAsDataURL(file);
        preview = result.data;
      }
      media[i] = {
        file,
        id,
        preview,
        progress: 0,
        tags: [],
        inputValue: "",
      };
    }
    setMedia([...media]);
  };

  const onAddTag = (item) => {
    const index = media.findIndex((existingMedia) => {
      return existingMedia.id === item.id;
    });
    console.log("index", index);
    media[index] = {
      ...media[index],
      tags: [...item.tags, item.inputValue],
      inputValue: "",
    };
    setMedia([...media]);
  };

  const onRemoveTag = (item, tag) => {
    console.log("removing tag");
    const index = media.findIndex((existingMedia) => {
      return existingMedia.id === item.id;
    });
    media[index] = {
      ...media[index],
      tags: media[index].tags.filter((t) => t !== tag),
      inputValue: "",
    };
    setMedia([...media]);
  };

  const onTagInputChange = (event, item) => {
    console.log("hi hi hi");
    const index = media.findIndex((existingMedia) => {
      return existingMedia.id === item.id;
    });
    media[index] = { ...media[index], inputValue: event.target.value };
    setMedia([...media]);
  };

  useEffect(() => {
    if (media.length > 0 && media.every((item) => item.url)) {
      const items = media.map((item) => ({
        url: item.url,
        timestamp: Timestamp.fromDate(startDate),
        type: item.file.type,
        id: item.id,
        tags: item.tags,
      }));
      mutate(items);
    }
  }, [media, startDate, mutate]);

  const uploadMedia = () => {
    media.forEach((item) => {
      const file = item.file;
      const fileRef = ref(storage, item.id);
      const uploadTask = uploadBytesResumable(fileRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const index = media.findIndex((existingMedia) => {
            return existingMedia.file.name === file.name;
          });
          media[index] = { ...media[index], progress };
          setMedia([...media]);
        },
        (error) => {
          console.log("cannot upload", error);
        },
        // save the downloadUrl to state once upload is complete
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const index = media.findIndex((existingMedia) => {
            return existingMedia.file.name === file.name;
          });
          media[index] = { ...media[index], url: downloadUrl };
          setMedia([...media]);
        }
      );
    });
  };

  const renderPreview = (item) => {
    if (item.file.type.includes("video")) {
      return (
        <video
          width="100"
          height="100"
          autoPlay
          muted
          controls
          style={{ display: "block" }}
        >
          <source src={`${item.preview}`} type="video/mp4" />
          <source src={`${item.preview}`} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return <img src={item.preview} alt="Preview" height={100} width={100} />;
  };

  return (
    <StyledPage>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <input
          type="file"
          multiple
          accept="video/mp4, video/x-m4v, video/*, image/*"
          onChange={changeHandler}
        />
        <div>
          {media.map((item) => {
            return (
              <div key={item.preview}>
                {renderPreview(item)}
                <div>{item.progress}</div>
                <Tags
                  onAdd={() => onAddTag(item)}
                  onRemove={(tag) => onRemoveTag(item, tag)}
                  tags={item.tags}
                  onChange={(e) => onTagInputChange(e, item)}
                  value={item.inputValue}
                  isAdmin={true}
                />
              </div>
            );
          })}
          <button
            onClick={uploadMedia}
            style={{ backgroundColor: "blue", color: "white" }}
          >
            Upload media
          </button>
        </div>
      </div>
    </StyledPage>
  );
}
