import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, DatePublic, VideoPlay, HeartComment, HashTag, Summary } from './MyDetailComponents'
import './MyDetail.css';

export function MyDetail({ data, heartdata, setPage, setPrevPage, setLike }) {

    // Send whether user likes or not
    const sendHeartStatus = (liked) => {
        const heart_data = { videoId: data.videoId, liked: liked };
        setLike(liked);

        fetch('/sendHearts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(heart_data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send heart status');
            }
            console.log(liked, 'Heart status sent successfully');
        })
        .catch(error => {
            console.error('Error sending heart status:', error);
        });
    };
    
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
                        <DatePublic date={data.date} isPublic={data.privacy} videoId={data.videoId}/>

                        <VideoPlay url={data.video}/>

                        <HeartComment isPublic={data.privacy} isLiked={heartdata.isLike} setPage={setPage} setPrevPage={setPrevPage} sendHeartStatus={sendHeartStatus} />

                        <div className="hashtag-container">
                            {data.hashtags && data.hashtags.map((tag, index) => (
                                <HashTag key={index? index: 0} value={ tag? tag: null } />
                            ))}
                        </div>

                        <Summary value= {data? data.summary: null} />
                    </motion.div>
                </AnimatePresence>
            )}
            <Navigation />
        </div>

    );

};
