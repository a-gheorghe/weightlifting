import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { Tags } from "./Tags";
import { addMediaItemsFirebase } from "./firebase-api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80%",
  overflow: "scroll",
};

export const UploadModal = ({ open, handleClose, date }) => {
  console.log("open is", open);
  const queryClient = useQueryClient();

  const [media, setMedia] = useState([]);
  const db = getFirestore();
  const storage = getStorage();
  const { mutate: addMedia } = useMutation(
    (items) => addMediaItemsFirebase(db, items),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["media", date]);
        setMedia([]);
        handleClose();
      },
    }
  );

  useEffect(() => {
    if (media.length > 0 && media.every((item) => item.url)) {
      const items = media.map((item) => ({
        url: item.url,
        timestamp: dayjs(date).startOf("day").unix(),
        type: item.file.type,
        id: item.id,
        tags: item.tags,
      }));
      console.log("adding media");
      addMedia(items);
    }
  }, [media, addMedia]);

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
    const index = media.findIndex((existingMedia) => {
      return existingMedia.id === item.id;
    });
    media[index] = { ...media[index], inputValue: event.target.value };
    setMedia([...media]);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Media for {dayjs(date).format("dddd MMMM DD YYYY")}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
        </Typography>
      </Box>
    </Modal>
  );
};
