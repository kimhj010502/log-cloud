import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, DatePublic, VideoPlay, HeartComment, HashTag, Summary } from './MyDetailComponents'
import './MyDetail.css';

export function MyDetail({ data, setPage, setPrevPage }) {
    return (
        <div className="detail-page">
            <LogHeader />

            {Object.keys(data).length === 0 ? ( // Check if data is empty
                <h2>Loading...</h2>
            ) : (
                <AnimatePresence mode='wait'>
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    >
                        <DatePublic date={data.date} isPublic={data.privacy} />

                        <VideoPlay url={data.video}/>

                        <HeartComment isPublic={data.privacy} isLiked={data.isLiked} setPage={setPage} setPrevPage={setPrevPage} videoId={data.videoId} />

                        <div className="hashtag-container">
                            {data.hashtags && data.hashtags.map((tag, index) => (
                                <HashTag key={index} value={ tag } />
                            ))}
                        </div>

                        <Summary value= {data.summary} />
                    </motion.div>
                </AnimatePresence>
            )}
            <Navigation />
        </div>

    );

};
