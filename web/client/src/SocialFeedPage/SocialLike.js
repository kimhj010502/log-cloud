import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, ProfileDate, Like } from './SocialLikeComponents'
import './SocialLike.css';

export function SocialLike({ data, id, profile, setPage, setPrevPage }) {
    return (
        <div className="social-like-page">
            <LogHeader setPage={setPage} setPrevPage={setPrevPage} />

            <ProfileDate date={data.date} id={id} profile_img_src={profile} />

            <AnimatePresence mode='wait'>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >

                <div className='comments-like-box'>
                    <h3>Liked by</h3>

                    {/* 좋아요 개수만큼 */}
                    <div className='likes-box'>
                        {data.likeList && data.likeImage.map((cont) => (
                            <Like img_src={cont.profile? cont.profile: null} id={cont.id? cont.id: null} />
                        ))
                        }
                    </div>
                </div>

                </motion.div>   
            </AnimatePresence>

            <Navigation />
        </div>

    );

};
