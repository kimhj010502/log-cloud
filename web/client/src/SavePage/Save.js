import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Loading from '../Routing/Loading'
import { LogDate, VideoPreview, HashTag, Summary, Scope, EditButton, SaveButton } from './SaveComponents'
import './Save.css';

function Save() {
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const prevURL = location.state?.prevURL;  // 이전 페이지의 URL
    const videoInfo = JSON.parse(location.state?.videoInfo);
    const summary = location.state?.summary
    const hashtags = location.state?.hashtags
    const switches = location.state?.switches

    console.log("save 페이지", videoInfo)

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

    const handleSave = async() => {
        console.log('save 시작')
        try {
            setLoading(true)
            const response = await fetch('/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoInfo: JSON.stringify(videoInfo), switches: switches, summary: summary, hashtags: hashtags }),
            });

            if (response.ok) {
                console.log(response)
                if (response.status === 200) {
                    const data = await response.json();
                    console.log("받은 데이터", data)
                    setLoading(false)
                    navigate('/', { state: { prevURL: '/save' } });
                }
                if (response.status === 400) {
                    console.log('Error during video save: 400');
                }
            }
        } catch (error) {
            console.error('Error saving:', error);
        }
    };


    return (
        <AnimatePresence>
        {loading ? <Loading /> : null}

        {isVisible && (prevURL === '/upload' || prevURL === '/after-edit') && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '200%' }}
            transition={{ duration: 0.5 }}
            className="save-page"
            >
                {LogDate(handleButtonClick, videoInfo)}

                <VideoPreview url={videoInfo.video_file_path} />

                {switches.hashtag && (
                    <div className="hashtag-container">
                        {hashtags && hashtags.map((tag, index) => (
                            <HashTag key={index} value={ tag } />
                        ))}
                    </div>
                )}

                {switches.summary && (
                    <Summary value={summary} />
                )}
                
                <Scope isPublic={switches.public} />
                
                <EditButton videoInfo={videoInfo} summary={summary} hashtags={hashtags} switches={switches} />
                <SaveButton handleSave={handleSave} />

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
                {LogDate(handleButtonClick, videoInfo)}

                <VideoPreview url={videoInfo.video_file_path} />

                {switches.hashtag && (
                    <div className="hashtag-container">
                        {hashtags && hashtags.map((tag, index) => (
                            <HashTag key={index} value={ tag } />
                        ))}
                    </div>
                )}

                {switches.summary && (
                    <Summary value={summary} />
                )}
                
                <Scope isPublic={switches.public} />
                
                <EditButton videoInfo={videoInfo} summary={summary} hashtags={hashtags} switches={switches} />
                <SaveButton handleSave={handleSave} />

            </motion.div>
        )}
        </AnimatePresence>
    )
}

export default Save