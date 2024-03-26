import { Link } from 'react-router-dom'

//날짜별 이미지
export function CalendarImg({url}) {
    return (
        <div className='calendar-img-box'>
            <img className="calendar-img" src={url} alt="calendar img"/>
        </div>
    )
}

let date = new Date(); 
let nowY = date.getFullYear();
let nowM = date.getMonth();
let nowD = date.getDate();

//이번 달
export function YearMonth({year, month}) {  
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentMonthName = monthNames[month];
    
    return (
        <div className="month">
            <h2>{` ${currentMonthName} ${year} `}</h2>
        </div>
    )
}

export function CalendarDate() {
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

            </table>
        </div>
    )
}

export function CalendarYearMonth({year, month, videos}) {
    let firstDayOfWeek = new Date(year, month, 1).getDay(); //첫날의 요일
    let startDayOfWeek = 1; //주의 시작을 월요일로 함
    let lastDay = new Date(year, month + 1, 0).getDate();
    let lastDayOfWeek = new Date(year, month, lastDay).getDay(); //마지막날의 요일

    let daysToFill = (firstDayOfWeek - startDayOfWeek + 7) % 7;
    let remainingDays = lastDay + (6 - lastDayOfWeek + startDayOfWeek) % 7;

    let weeks = Math.ceil(remainingDays / 7);

    //  format: [{'date': 8, 'coverImage': '.'}, {'date': 9, 'coverImage': '.'}]
    // videos format: [{'date': 8, 'coverImage': '.', 'videoId':'~~'}, ..]
    console.log("calendar year month:", videos);

    return (
        <div className="calendar">
            <table border='1'>

            <tbody>
                {Array.from({ length: weeks }, (_, rowIndex) => (
                    
                <tr key={rowIndex}>
                    {Array.from({ length: 7 }, (_, colIndex) => {
                    const day = rowIndex * 7 + colIndex - daysToFill + 1;
                    const isOutOfRange = day < 1 || day > lastDay;
                    const isToday = (year === nowY) && (month === nowM) && (day === nowD);
                    const logEntry = videos.find(video => video.date === day);

                    return (
                        <td key={colIndex}>
                            {logEntry ? (
                                <Link to={{ pathname: '/feed'}}
                                    state={{ videoId: logEntry.videoId}}
                                      preventScrollReset={true} >
                                    <CalendarImg url={logEntry.coverImage} />
                                </Link>
                            ) : (
                                <Link to={'/'}>
                                    <img className="calendar-img" src="black.png" alt="calendar img"/>
                                </Link>
                            )}
                            <div className={`calendar-date-box ${isToday ? 'today' : 'day'}`}>
                                <p className="calendar-date">{isOutOfRange ? '\u00a0' : day}</p>
                            </div>
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