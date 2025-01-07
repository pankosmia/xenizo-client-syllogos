import React, { useContext } from 'react';
import {createRoot} from "react-dom/client";
import {Spa,SpSpa,bcvContext,postEmptyJson} from "pithekos-lib";
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";


import Home from './pages/Home';
import ExchangeData from './pages/Repositories'
import ProjectPage from './pages/Projects';
import ArchivePage from './pages/Archive';
const {bcvRef} =useContext(bcvContext);

const router = createHashRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/archives/",
        element: <ArchivePage/>,
    },
    {
        path: "/projects/",
        element: <ProjectPage/>,
    },
    {
        path: "/profile/",
        element: <ExchangeData/>,
    }
    
    
]);

createRoot(document.getElementById("root"))
    .render(
        <SpSpa    
        requireNet={false}
        titleKey="pages:xenizo-syllogos:title"
        currentId="xenizo-syllogos"
        >
            <Spa>
                <RouterProvider router={router}/>
                <p onClick={()=> postEmptyJson("/navigation/bcv/MRK/3/5")}>Do Bcv {JSON.stringify(bcvRef.current)}</p>
            </Spa>
        </SpSpa>
    );