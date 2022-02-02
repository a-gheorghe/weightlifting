import React from 'react';
import styled from 'styled-components';


const UnstyledFolder = ({ children, className, onClick }) => {
    return (
        <div className={className} onClick={onClick}>{children}</div>
    )
}

const Folder = styled(UnstyledFolder)`
width: 150px;
height: 105px;
margin: 50px 50px;
position: relative;
background: rgb(110,166,239);
background: linear-gradient(183deg, rgba(110,166,239,1) 11%, rgba(30,92,172,1) 100%);
border-radius: 0 6px 6px 6px;
transition: 0.10s ease-out;
border: none;
cursor: pointer;
box-shadow: 4px 4px 7px rgba(0, 0, 0, 0.59);
display: flex;
justify-content: center;
align-items: center;

&:hover{
    transform: scale(1.2);
  }

  &:before {
    content: '';
    width: 46%;
    height: 21px;
    clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
    border-radius: 4px 0px 0 0;
    background-color: #1e5cac;
    position: absolute;
    top: -10.3px;
    left: 0px;
}

&:after {
    content: '';
    width: 29%;
    height: 5px;
    border-radius: 2px 2px 0 0;
    background-color: #ffffff;
    position: absolute;
    top: 5.6px;
    left: 4px;
}
`

export default Folder;