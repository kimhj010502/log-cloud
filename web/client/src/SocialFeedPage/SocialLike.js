import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, ProfileDate, Like } from './SocialLikeComponents'
import './SocialLike.css';

export function SocialLike({ data, setPage, setPrevPage }) {
    return (
        <div className="social-like-page">
            <LogHeader setPage={setPage} setPrevPage={setPrevPage} />

            <ProfileDate date={data.date} id="test_id" profile_img_src="profile.png" />

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
                        <Like img_src='profile.png' id='test_id1' />
                        <Like img_src='profile.png' id='test_id2' />
                        <Like img_src='profile.png' id='test_id1' />
                        <Like img_src='profile.png' id='test_id2' />
                        <Like img_src='profile.png' id='test_id1' />
                        <Like img_src='profile.png' id='test_id2' />
                        <Like img_src='profile.png' id='test_id1' />
                        <Like img_src='profile.png' id='test_id2' />
                        <Like img_src='profile.png' id='test_id2' />
                        <Like img_src='profile.png' id='test_id1' />
                        <Like img_src='profile.png' id='test_id2' />
                    </div>
                </div>

                </motion.div>   
            </AnimatePresence>

            <Navigation />
        </div>

    );

};
