import { MenuOutlined, TeamOutlined, SearchOutlined, LineChartOutlined } from '@ant-design/icons';

//Current Month
export function Month() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentMonthName = monthNames[currentMonth];
    
    return (
        <div className="month">
            <h2>{` ${currentMonthName} `}</h2>
        </div>
        );
}



//Current Month Calendar
export function Calendar() {
    let date = new Date(); 
    let nowY = date.getFullYear();
    let nowM = date.getMonth(); 
    let nowD = date.getDate(); 
    
    let y = nowY;
    let m = nowM;
    
    let theDate = new Date(y, m, 1); 
    let theDay = theDate.getDay();

    let last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let lastDate;
    if ( ( (y % 4 === 0) && (y % 100 !==0) ) || (y % 400 === 0) ) lastDate = last[1] = 29;

    lastDate = last[m];

    let row = Math.ceil((theDay+lastDate) / 7);

    return (
        <div className="calendar">
            <table border='1'>
                <thead>
                    <tr>
                        <th>MON</th>
                        <th>TUE</th>
                        <th>WED</th>
                        <th>THU</th>
                        <th>FRI</th>
                        <th>SAT</th>
                        <th>SUN</th>
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: row }, (_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: 7 }, (_, colIndex) => {
                        const day = rowIndex * 7 + colIndex - theDay + 2;
                        const isOutOfRange = day <= 0 || day > lastDate;
                        const isToday = (day === nowD);

                        return (
                            <td key={colIndex}>
                                {isOutOfRange ? (
                                    <img className="calendar-img" src="black.png" alt="calendar image"/>
                                ) : (
                                    <img className="calendar-img" src="test_image.jpg" alt="calendar image"/>
                                )}
                                
                                {isToday ? (
                                <div className="calendar-date-box today">
                                    <p className="calendar-date">{isOutOfRange ? '\u00a0' : day}</p>
                                </div>
                                ) : (
                                <div className="calendar-date-box">
                                    <p className="calendar-date">{isOutOfRange ? '\u00a0' : day}</p>
                                </div>
                                )}
                            </td>
                        );

                        })}
                    </tr>
                    ))}
                </tbody>
                
            </table>
        </div>
    );
}

//카메라 버튼
export function Camera() {
    return (
        <div className="camera">
            <button className="cameraButton"></button>
        </div>
    )
}

//Nav Bar
export function Navigation() {
    return (
        <div className="navigation">
            <MenuOutlined className="icon"/>
            <TeamOutlined className="icon"/>
            <SearchOutlined className="icon"/>
            <LineChartOutlined className="icon"/>
            <div className="profile">
                <img className="profile-img" src="profile.png" alt="profile image"/>
            </div>
        </div>
    )
}