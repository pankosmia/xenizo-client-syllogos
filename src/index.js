import React, { useContext } from 'react';
import {createRoot} from "react-dom/client";
import {Spa,SpSpa} from "pithekos-lib";
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";

import Home from './pages/Home';
import ArchivePage from './pages/Archives';
import ProfileUser from './pages/ProfileUser';
import ExchangeData from './pages/Repositories';
import Organisation from './pages/Organization';
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
        path: "/profile/",
        element: <ProfileUser/>,
    },
    {
        path:"/contribution/",
        element: <ExchangeData/>
    },
    {
        path:"/organisation/",
        element: <Organisation/>
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
            </Spa>
        </SpSpa>
    );