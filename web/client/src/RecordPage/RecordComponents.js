import { Link } from 'react-router-dom'
import { DownOutlined } from '@ant-design/icons'

//상단바 날짜
export function LogDate(handleButtonClick) {
    let date = new Date()
    let nowY = date.getFullYear()
    let nowM = date.getMonth()
    let nowD = date.getDate()

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let currentMonthName = monthNames[nowM]

    return (
        <div className="date-box">
            <DownOutlined className="down-button" onClick={handleButtonClick}/>
            <h2>{` ${currentMonthName} ${nowD}, ${nowY} `}</h2>
        </div>
    )
}



export function UploadButton() {
    return (
        <div className="upload-button">
            <Link to={'/upload'} state={{ prevURL: '/record' }} class="upload-link">
                <div>UPLOAD</div>
            </Link>
        </div>
    )
}
