import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { checkBrowser, CameraRecord } from './Camera'
import { LogDate } from './RecordComponents';
import './Record.css'

function Record() {
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
                    {LogDate(handleButtonClick)}

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
                    {LogDate(handleButtonClick)}

                    <CameraRecord />

                </motion.div>
            )}
                
            
        </AnimatePresence>
    )
}

// //접속 기기 및 브라우저 확인
// function checkBrowser() {
//     // 안드로이드 모바일 기기인 경우 webm 지정
//     if (/Android/i.test(navigator.userAgent)) {
//         return ['android', 'webm']
//     }
//     // ios 모바일 기기인 경우 mp4 지정
//     else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
//         return ['ios', 'mp4']
//     }
//     // Windows 의 Chrome 브라우저인 경우 webm 지정
//     else if (navigator.userAgent.indexOf("Chrome") > -1) {
//         return ['chrome', 'webm']
//     }
//     // Mac OS 의 Safari 브라우저인 경우 mp4 지정
//     else if (navigator.userAgent.indexOf("Safari") > -1) {
//         return ['safari', 'mp4']
//     }
// }

export default Record