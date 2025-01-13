import React from 'react';
import Navigation from '../components/Navigation';
import Door43LoginButton from '../services/ConnectWithDoor43';


const Home = () => {
    return (
        <div>
            <Navigation/>
            <Door43LoginButton/>
            <p> Veuillez vous connecter </p>
          
        </div>
    );
};

export default Home;