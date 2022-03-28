import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";

const StyledPage = styled.div`
  background-color: #f2f6fd;
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default function Calendar() {
  const navigate = useNavigate();
  // month from params is starting with Jan = 1
  const { year, month } = useParams();
  const [value, setValue] = useState(undefined);

  useEffect(() => {
    setValue(new Date(Number(year), Number(month) - 1, 1));
  }, [year, month]);

  console.log("value is", value);

  const content = () => {
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
      <ReactCalendar
        onChange={setValue}
        value={value}
        showNeighboringMonth={false}
        activeStartDate={value}
        onActiveStartDateChange={onActiveStartDateChangeHandler}
        // calendarType={"US"}
        tileContent={content}
      />
    </StyledPage>
  );
}
