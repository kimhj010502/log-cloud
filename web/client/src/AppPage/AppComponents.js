import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Loading from '../Routing/Loading'
import { HomeOutlined, TeamOutlined, SearchOutlined, LineChartOutlined } from '@ant-design/icons'
import { YearMonth, CalendarDate, CalendarYearMonth } from './Calendar'

export async function getUserInfo() {
    try {
        const response = await fetch('/@me', {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        const data = await response.json();
        return {username: data.username, createdAt: data.createdAt};
    } catch (error) {
        console.error('Error fetching username:', error);
        return null;
    }
}

//이번 달 달력
export function Calendar() {
    const [loading, setLoading] = useState(false);

    let date = new Date();
    const todayYear = date.getFullYear();
    const todayMonth = date.getMonth();

    const [currentYear, setCurrentYear] = useState(date.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());

    const [videos, setVideos] = useState([]);

    let userCreatedMonth;
    let userCreatedYear;

    async function loadCalendarView(currentMonth, currentYear) {

        // POST request to get cover images
        try {
            setVideos([]);
            setLoading(true);

            const user = await getUserInfo();
            const userCreatedAt = new Date(user.createdAt);
            userCreatedMonth = userCreatedAt.getMonth();
            userCreatedYear = userCreatedAt.getFullYear();
            sessionStorage.setItem('userCreatedMonth', userCreatedMonth);
            sessionStorage.setItem('userCreatedYear', userCreatedYear);

            const response = await fetch('/month-overview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: user.username, month: currentMonth, year: currentYear}),
            });

            // response format: [{'date': 8, 'coverImage': '.', 'videoId':'~~'}, ..]
            if (response.ok) {
                if (response.status === 200) {
                    const data = await response.json();
                    data.forEach(entry => {
                        setVideos(data);
                        // console.log("VIDEO ID:", entry.videoId);
                    });
                    setLoading(false);
                }
            } else if (response.status === 404){
                console.log("no video found for this month");
                // black image set for all months
                setVideos([]);
                setLoading(false);
            } else {
                console.log("month-overview api response not ok");
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching month-overview api:', error);
        }
    }


    useEffect(() => {
        let startX;
        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            const deltaX = e.touches[0].clientX - startX;

            if (e.target.closest('.calendarBox')) {
                // 왼쪽 방향으로 스크롤 -> 다음 달
                if ((deltaX < -100) && ((currentYear < todayYear) || (currentMonth < todayMonth))) {
                    const newMonth = currentMonth + 1;
                    const newYear = newMonth > 11 ? currentYear + 1 : currentYear;
                    setCurrentMonth(newMonth > 11 ? 0 : newMonth);
                    setCurrentYear(newYear);

                    // load new data for the updated month / year
                    loadCalendarView(newMonth, newYear);
                }

                // 오른쪽 방향으로 스크롤 -> 이전 달
                if (deltaX > 100 && ((currentYear > userCreatedYear) || (currentMonth > userCreatedMonth))) {
                    const newMonth = currentMonth - 1;
                    const newYear = newMonth < 0 ? currentYear - 1 : currentYear;
                    setCurrentMonth(newMonth < 0 ? 11 : newMonth);
                    setCurrentYear(newYear);

                    // load new data for the updated month / year
                    loadCalendarView(newMonth, newYear);
                }
            }
        };

        loadCalendarView(currentMonth, currentYear);

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [currentYear, currentMonth])

    return (
        <div className="calendarBox">
            {loading ? <Loading /> : null}
            
            <YearMonth year={currentYear} month={currentMonth}/>

            <CalendarDate />

            <AnimatePresence mode="wait">
                <motion.div
                key={currentMonth}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.2 }}
                >
                    <CalendarYearMonth year={currentYear} month={currentMonth} videos={videos} />
                </motion.div>

            </AnimatePresence>
        </div>
    )
}


//카메라 버튼
export function CameraButton() {
    let date = new Date();
    const todayYear = date.getFullYear();
    const todayMonth = date.getMonth() + 1;
    const todayDate = date.getDate();

    const navigate = useNavigate();

    const handleAddLog = async() => {
        try {
            const response = await fetch('/add_log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ upload_date: [todayYear, todayMonth, todayDate] }),
            });

            if (response.ok) {
                console.log(response)
                if (response.status === 200) {
                    const data = await response.json();
                    console.log("received data");
                    console.log(data);
                    if (data.video_exists) {
                        console.log("EXISTS");
                        const confirmRecord = window.confirm('You have already uploaded a video today. Do you want to overwrite?');
                        if (confirmRecord) {
                            navigate('/record', { state: { prevURL: '/', uploadDate: JSON.stringify(data.upload_date) } });
                        }
                    } else {
                        navigate('/record', { state: { prevURL: '/', uploadDate: JSON.stringify(data.upload_date) } });
                    }
                }
                if (response.status === 400) {
                    console.log('Error during adding log: 400');
                }
            }

        } catch (error) {
            console.error('Error adding log:', error);
        }
    };

    return (
        <div className="camera">
            <img className="camera-button" src="logo.png" onClick={handleAddLog} alt="logo img"/>
        </div>
    )
}

//내비게이션 바
export function Navigation({ imgSrc }) {
    const location = useLocation();
    const page = location.pathname

    let isHome = (page === '/')
    let isSocial = ((page === '/social') || (page === '/social-feed'))
    let isSearch = (page === '/search')
    let isAnalysis = (page === '/analysis')
    let isProfile = (page === '/profile')

    const [username, setUsername] = useState(sessionStorage.getItem('username'));

    if (!username ) {
        const user = getUserInfo();

        setUsername(user.username);
        sessionStorage.setItem('username', username);
    }

    return (
        <div className="navigation">
            <hr />
            <Link to={'/'}>
                {isHome && (
                    <HomeOutlined className="icon-select"/>
                )}
                {!isHome && (
                    <HomeOutlined className="icon"/>
                )}
            </Link>

            <Link to={'/social'}>
                {isSocial && (
                    <TeamOutlined className="icon-select"/>
                )}
                {!isSocial && (
                    <TeamOutlined className="icon"/>
                )}
            </Link>
            
            <Link to={'/search'}>
                {isSearch && (
                    <SearchOutlined className="icon-select"/>
                )}
                {!isSearch && (
                    <SearchOutlined className="icon"/>
                )}
            </Link>

            <Link to={'/analysis'}>
            {isAnalysis && (
                <LineChartOutlined className="icon-select"/>
            )}
            {!isAnalysis && (
                <LineChartOutlined className="icon"/>
            )}
            </Link>

            <Link to={'/profile'}>
            {isProfile && (
                <div className="profile-select">
                <img className="profile-img" src={imgSrc} alt="profile img"/>
            </div>
            )}
            {!isProfile && (
                <div className="profile">
                <img className="profile-img" src={imgSrc} alt="profile img"/>
            </div>
            )}
            </Link>
        </div>
    )
}