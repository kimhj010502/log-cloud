import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogDate, VideoPreview, HashTag, Summary, Scope, EditButton, SaveButton } from './SaveComponents'
import './Save.css';

function Save() {
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/generateDetails").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            })
    }, []);


    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (!isVisible) {
          setTimeout(() => {
            navigate('/upload')
          }, 300);
        }
    }, [isVisible, navigate])
    
    const handleButtonClick = () => {
        setIsVisible(!isVisible)
    }

    const location = useLocation();
    const prevURL = location.state?.prevURL;  // 이전 페이지의 URL

    return (
        <AnimatePresence>
        {isVisible && (prevURL === '/upload' || prevURL === '/after-edit') && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '200%' }}
            transition={{ duration: 0.5 }}
            className="save-page"
            >
                {LogDate(handleButtonClick)}

                <VideoPreview url="test_video.mp4" />

                <div className="hashtag-container">
                    {data.hashtags && data.hashtags.map((tag, index) => (
                        <HashTag key={index} value={ tag } />
                    ))}
                </div>

                <Summary value={data.summary} />
                
                <Scope isPublic={true} />
                
                <EditButton />
                <SaveButton />

            </motion.div>
        )}

        {isVisible && prevURL === '/edit' && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-200%' }}
            transition={{ duration: 0.5 }}
            className="save-page"
            >
                {LogDate(handleButtonClick)}

                <VideoPreview url="test_video.mp4" />

                <div className="hashtag-container">
                    {data.hashtags && data.hashtags.map((tag, index) => (
                        <HashTag key={index} value={ tag } />
                    ))}
                </div>

                <Summary value={data.summary} />
                
                <Scope isPublic={true} />
                
                <EditButton />
                <SaveButton />

            </motion.div>
        )}
        </AnimatePresence>
    )
}

export default Save