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

export default Record