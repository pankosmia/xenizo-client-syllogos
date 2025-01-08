import React from 'react';
import Navigation from '../components/Navigation';
import Door43LoginButton from '../services/ConnectWithDoor43';
import {bcvContext,postEmptyJson} from "pithekos-lib";
import { useContext } from 'react';



const Home = () => {
    const {bcvRef} =useContext(bcvContext);
    return (
        <div>
            <Door43LoginButton/>
            <Navigation/>
            <p> Veuillez vous connecter </p>
            <p onClick={()=> postEmptyJson("/navigation/bcv/MRK/3/5")}>Do Bcv {JSON.stringify(bcvRef.current)}</p>
        </div>
    );
};

export default Home;