import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import { useNavigate, useParams } from "react-router";
import { getFirestore } from "firebase/firestore";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { getMediaMonthFirebase } from "../firebase-api";
import styled from "styled-components";

const StyledPage = styled.div`
  background-color: #f2f6fd;
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default function Calendar() {
  const db = getFirestore();
  const navigate = useNavigate();
  // month from params is starting with Jan = 1
  const { year, month } = useParams();
  const [value, setValue] = useState();

  const firstOfMonth = new Date(Number(year), Number(month) - 1, 1);

  useEffect(() => {
    setValue(firstOfMonth);
  }, [year, month]);

  const { data: media } = useQuery(["media", firstOfMonth], () =>
    getMediaMonthFirebase(db, firstOfMonth)
  );

  console.log("media is", media);

  const lift = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 122.88 116.01"
    >
      <defs></defs>
      <title>weightlifting</title>
      <path
        className="cls-1"
        d="M122.88,29.45h-5.53V9.28h5.53V29.45ZM92.8,15.54h3.29a1.54,1.54,0,0,1,1.45,1h4.85v5.21H96.83c-6.43,11.76-13.25,24.1-20.9,34.51-1.37,1.86-1.52,1.49-2.06,3.5-1.1,4.19-1.05,7.67-1.09,12.11C74.58,76.88,80.9,92,80.9,95v21H71.16V95c0-1.72-6.06-8-7.64-11.41h0c-1.66.06-2.53.12-4.19.18l0,0c-1.7,3.45-7.57,9.55-7.57,11.24v21H42V95c0-3,6.29-18.11,8.11-23.12-.1-4.55,0-8.06-1-12-.54-2.13-.68-1.61-2.14-3.59-7.65-10.41-14.46-22.74-20.89-34.5H19.81V16.57h5.25a1.55,1.55,0,0,1,1.46-1h3.29a1.54,1.54,0,0,1,1.45,1H91.34a1.55,1.55,0,0,1,1.46-1ZM68.54,47.07h-.33c-4.38-1.25-8.67-1.51-12.87,0h-1c-7-7.48-13.4-16.51-20.73-25.29H89.27c-7.33,8.78-13.69,17.81-20.73,25.29Zm-7.1-22.95A9.88,9.88,0,1,1,51.57,34a9.87,9.87,0,0,1,9.87-9.88Zm54.83,14.24H105.88V0h10.39V38.36Zm-99.37,0H6.51V0H16.9V38.36ZM5.43,29.45H0V9.28H5.43V29.45Z"
      />
    </svg>
  );

  const content = ({ date }) => {
    const timestamp = dayjs(date).startOf("day").unix();
    if (media.find((m) => m.timestamp === timestamp)) {
      return <div> {lift} </div>;
    }
    return (
      <>
        <img
          style={{ display: "block" }}
          alt="random"
          src="https://source.unsplash.com/80x80/?animal"
        />
      </>
    );
  };

  const onActiveStartDateChangeHandler = ({ activeStartDate }) => {
    const month = activeStartDate.getMonth() + 1;
    const year = activeStartDate.getFullYear();
    navigate(`/calendar/${year}/${month}`);
  };

  return (
    <StyledPage>
      {media && (
        <ReactCalendar
          onChange={(val) =>
            navigate(`/calendar/${year}/${month}/${val.getDate()}`)
          }
          value={value}
          showNeighboringMonth={false}
          activeStartDate={value}
          onActiveStartDateChange={onActiveStartDateChangeHandler}
          // calendarType={"US"}
          tileContent={content}
        />
      )}
    </StyledPage>
  );
}
