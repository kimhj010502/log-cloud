import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, ProfileDate, VideoPlay, HeartComment, HashTag, Summary } from './SocialDetailComponents'
import './SocialDetail.css';

export function SocialDetail({ data, setPage, setPrevPage }) {
    return (
        <div className="social-detail-page">
            <LogHeader />

            <ProfileDate date={data.date} id="test_id" profile_img_src="profile.png" />

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
                        
                        <VideoPlay url="test_video.mp4"/>

                        <HeartComment isPublic={true} isLiked={false} setPage={setPage} setPrevPage={setPrevPage} />

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