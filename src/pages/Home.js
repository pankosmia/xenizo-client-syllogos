import React from 'react';
import Navigation from '../components/Navigation';
import Door43LoginButton from '../services/ConnectWithDoor43';


const Home = () => {
    return (
        <div>
            <Navigation/>
            <p> Log in to Door43 to use the chat room </p>
            <Door43LoginButton/>
          
        </div>
    );
};

export default Home;