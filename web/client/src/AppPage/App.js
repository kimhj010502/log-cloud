import { Calendar, CameraButton, Navigation } from './AppComponents';
import './App.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();
    //
    // useEffect(() => {
    //     // Fetch authentication status from the backend
    //     fetch('/check_authentication')
    //         .then(response => response.json())
    //         .then(data => {
    //             if (!data.authenticated){
    //                 navigate("login");
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error checking authentication:', error);
    //         });
    // }, []);

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