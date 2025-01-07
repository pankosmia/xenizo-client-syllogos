import React from 'react';
import Navigation from '../components/Navigation';
import Door43LoginButton from '../services/ConnectWithDoor43';

const Home = () => {
    return (
        <div>
            <Door43LoginButton/>
            <Navigation/>
            <p> Veuillez vous connecter </p>
        </div>
    );
};

export default Home;