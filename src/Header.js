import React, { useContext } from 'react';
import GoogleButton from 'react-google-button'

import { Link } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, browserSessionPersistence, setPersistence, signOut } from 'firebase/auth'
import { UserContext } from './UserContext';
import { isAdmin } from './utils';
import styled from 'styled-components';

const StyledHeader = styled.header`
    height: 56px;
    display: flex; 
    justify-content: ${props => props.user ? "space-between" : "flex-end"};
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid grey;
`

const Avatar = styled.img`
    background-size: 32px 32px;
    border: 0;
    border-radius: 50%;
    display: block;
    margin: 0px;
    position: relative;
    height: 32px;
    width: 32px;
    z-index: 0;
`;

const provider = new GoogleAuthProvider();

export const Header = () => {
    const { user } = useContext(UserContext);
    const auth = getAuth();

    const clickLogin = async () => {
        try {
            await setPersistence(auth, browserSessionPersistence)
            await signInWithPopup(auth, provider)
        }
        catch(error) {
            alert(error);
        }
    }

    const clickLogout = async () => {
        try {
            await signOut(auth);
        }
        catch(error) {
            alert(error)
        }
    }
    
    return (
        <StyledHeader user={user}>
            <Link to="/"> Home</Link>
            {user ? 
                <>
                    <button onClick={clickLogout}> Logout</button>
                    {isAdmin(user) && <Link to="/add"> Add media </Link>}
                    <Avatar src={`${user.photoURL}`} alt={user.displayName} />
                </>
                :
                <GoogleButton
                    onClick={clickLogin}
                />
            }
        </StyledHeader>
    )
}