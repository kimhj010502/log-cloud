import React, { useState, useEffect  } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogDate, VideoPreview, Toggle, SelectEmotion, NextButton } from './UploadComponents'
import './Upload.css'


function Upload() {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (!isVisible) {
          setTimeout(() => {
            navigate('/record')
          }, 300);
        }
    }, [isVisible, navigate])
    
    const handleButtonClick = () => {
        setIsVisible(!isVisible)
    };

    const location = useLocation();
    const prevURL = location.state?.prevURL;  // 이전 페이지의 URL

    return (
        <AnimatePresence>
        {isVisible && prevURL === '/record' && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '200%' }}
            transition={{ duration: 0.5 }}
            className="upload-page"
            >
                {LogDate(handleButtonClick)}

                <VideoPreview url="test_video.mp4" />

                <Toggle />

                <SelectEmotion />

                <NextButton />

            </motion.div>
        )}

        {isVisible && prevURL === '/save' && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-200%' }}
            transition={{ duration: 0.5 }}
            className="upload-page"
            >
                {LogDate(handleButtonClick)}

                <VideoPreview url="test_video.mp4" />

                <Toggle />

                <SelectEmotion />

                <NextButton />

            </motion.div>
        )}
        </AnimatePresence>
    )
}


export default Upload