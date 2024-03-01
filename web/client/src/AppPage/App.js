import { Calendar, CameraButton, Navigation } from './AppComponents';
import './App.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function App() {

    return (
        <div className="app-page">
            <h1>log your memory</h1>

            <Calendar />
            <CameraButton />

            <Navigation />
        </div>
    )
}

export default App