import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { checkBrowser, CameraRecord } from './Camera'
import { LogDate } from './RecordComponents';
import './Record.css'

function Record() {
    //sessionStorage.removeItem('video_info');
    console.log(sessionStorage)

    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (!isVisible) {
          setTimeout(() => {
            navigate('/')
          }, 300);
        }
    }, [isVisible, navigate])
    
    const handleButtonClick = () => {
        setIsVisible(!isVisible)
    };

    const location = useLocation();
    const prevURL = location.state?.prevURL;  // 이전 페이지의 URL
    const uploadDate = JSON.parse(location.state?.uploadDate)
    // const uploadDate = JSON.parse(location.state?.uploadDate) ? JSON.parse(location.state?.uploadDate) : JSON.stringify({ upload_date: [todayYear, todayMonth, todayDate] });

    // let date = new Date();
    // const todayYear = date.getFullYear();
    // const todayMonth = date.getMonth() + 1;
    // const todayDate = date.getDate();
    
    // uploadDate = uploadDate ? uploadDate : JSON.stringify({ upload_date: [todayYear, todayMonth, todayDate] })
    console.log("REcord 페이지 실행")
    console.log(uploadDate)

    useEffect(() => {
        let [name, videoType] = checkBrowser()
        //ios에서 chrome 브라우저를 사용할 때 alert 메세지 띄우기
        if (name === 'ios') {
            alert('카메라 사용을 위해 Safari 브라우저를 이용해주시거나 갤러리에서 영상을 첨부해주세요.')
        }
    }, [])

    return (
        <AnimatePresence>
            {isVisible && prevURL === '/' && (
                <motion.div
                key="visible"
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '200%' }}
                transition={{ duration: 0.5 }}
                className="record-page"
                >
                    {LogDate(handleButtonClick, uploadDate)}

                    <CameraRecord />

                </motion.div>
            )}

            {isVisible && prevURL === '/upload' && (
                <motion.div
                key="visible"
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: '200%' }}
                transition={{ duration: 0.5 }}
                className="record-page"
                >
                    {LogDate(handleButtonClick, uploadDate)}

                    <CameraRecord />

                </motion.div>
            )}
                
            
        </AnimatePresence>
    )
}

export default Record