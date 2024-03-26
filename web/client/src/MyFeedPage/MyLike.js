import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, DatePublic, Like } from './MyLikeComponents'
import './MyLike.css';

export function MyLike({ data, heartdata, setPage, setPrevPage }) {
    return (
        <div className="like-page">
            <LogHeader setPage={setPage} setPrevPage={setPrevPage} />

            <DatePublic date={data.date} isPublic={data.privacy} />

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
                        {heartdata.likeList.map((cont) => (
                            <Like img_src={sessionStorage.getItem(cont)? sessionStorage.getItem(cont): null} id={cont? cont: null} />
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
