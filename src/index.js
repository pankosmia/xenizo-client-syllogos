import React, { useContext } from 'react';
import {createRoot} from "react-dom/client";
import {Spa,SpSpa} from "pithekos-lib";
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";

import ChatIcon from '@mui/icons-material/Chat';
import Home from './pages/Home';
import ProjectPage from './pages/Projects';
import ArchivePage from './pages/Archive';
import ProfileUser from './pages/ProfileUser';
import ExchangeData from './pages/Repositories';

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
        element: <ProfileUser/>,
    },
    {
        path:"/contribution/",
        element: <ExchangeData/>
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