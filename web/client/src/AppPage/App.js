import { Calendar, CameraButton, Navigation } from './AppComponents';
import './App.css'
import {Link, useNavigate} from "react-router-dom";

function App({ imgSrc }) {

    return (
        <div className="app-page">
            <Link to={'/'} className="home-link">
                <h1>log your memory</h1>
            </Link>

            <Calendar />
            <CameraButton />

            <Navigation imgSrc={imgSrc} />
        </div>
    )
}

export default App