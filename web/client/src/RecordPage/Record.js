import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { CameraRecord } from './Camera'
import { LogDate, UploadButton } from './RecordComponents';
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
                    
                    <UploadButton />

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
                    
                    <UploadButton />
                </motion.div>
            )}
                
            
        </AnimatePresence>
    )
}

export default Record