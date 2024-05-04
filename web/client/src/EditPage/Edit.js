import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogDate, EditHashTag, AddHashTag, EditSummary, UpdateButton } from './EditComponents'
import './Edit.css';

function Edit() {
    const location = useLocation();
    // console.log(location.state?.videoInfo)
    const prevURL = location.state?.prevURL;  // 이전 페이지의 URL
    const videoInfo = JSON.parse(location.state?.videoInfo);
    const summary = location.state?.summary
    const hashtags = location.state?.hashtags
    const switches = location.state?.switches

    console.log('Edit 페이지', videoInfo)

    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (!isVisible) {
          setTimeout(() => {
            navigate('/save')
          }, 300);
        }
    }, [isVisible, navigate])
    
    const handleButtonClick = () => {
        setIsVisible(!isVisible)
    }


    //해시태그 삭제
    const [prevHashtags, setPrevHashtags] = useState(hashtags);
    
    useEffect(() => {
        setPrevHashtags(hashtags)
    }, []);
    
    const onRemove = (index) => {
        const newHashtags = [...prevHashtags.slice(0, index), ...prevHashtags.slice(index + 1)]
        setPrevHashtags(newHashtags)
    }

    //해시태그 추가
    const [newHashtag, setNewHashtag] = useState();

    const onAdd = (newHashtag) => {
        const newHashtags = [...prevHashtags, newHashtag]
        setPrevHashtags(newHashtags)
        setNewHashtag('')
    }
    
    console.log('hashtag', prevHashtags);

    const [currentSummary, setCurrentSummary] = useState(summary);

    return (
        <AnimatePresence>
        {isVisible && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '200%' }}
            transition={{ duration: 0.5 }}
            className="edit-page"
            >
                {LogDate(handleButtonClick, videoInfo, summary, hashtags, switches)}

                <div className="hashtag-container">
                    {prevHashtags && prevHashtags.map((tag, index) => (
                        index !== 0 ? (
                            <EditHashTag index={index} value={tag} onRemove={onRemove} />
                        ) : null
                    ))}
                </div>

                <AddHashTag newHashtag={newHashtag} setNewHashtag={setNewHashtag} onAdd={onAdd} />

                <EditSummary prevSummary={summary} currentSummary={currentSummary} setCurrentSummary={setCurrentSummary} />
                
                <UpdateButton videoInfo={videoInfo} summary={currentSummary} hashtags={prevHashtags} switches={switches} />

            </motion.div>
        )}
        </AnimatePresence>
    )
}

export default Edit