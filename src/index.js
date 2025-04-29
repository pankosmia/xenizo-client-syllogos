import React from 'react';
import {createRoot} from "react-dom/client";
import {Spa,SpSpa} from "pithekos-lib";
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import ExchangeData from './pages/Repositories';

const router = createHashRouter([

    {
        path:"/",
        element: <ExchangeData/>
    },
    
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