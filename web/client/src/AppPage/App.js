import { Calendar, CameraButton, Navigation } from './AppComponents';
import './App.css'

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