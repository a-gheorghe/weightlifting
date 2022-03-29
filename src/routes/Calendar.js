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

  const content = ({ date }) => {
    const timestamp = dayjs(date).startOf("day").unix();
    if (media.find((m) => m.timestamp === timestamp)) {
      return <div> has media! </div>;
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
