import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, ProfileDate, LikeList, Comment, AddComment } from './SocialCommentComponents'
import './SocialComment.css';

export function SocialComment({ data, date, username, profile, setPage, prevPage, setPrevPage }) {
    return (
        <div className="social-comment-page">
            
            <LogHeader setPage={setPage} setPrevPage={setPrevPage} />

            <ProfileDate date={date} id={username} profile_img_src={profile} />

            <AnimatePresence mode='wait'>
                {prevPage === 'social-detail' && (
                    <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '200%', when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    style={{ zIndex: 1 }}
                    >

                    <div className='comments-like-box'>

                        <LikeList like_id_list={ data.likeList? data.likeList: [] } setPage={setPage} setPrevPage={setPrevPage} />

                        {/* 댓글 개수만큼 */}
                        <div className='comments-box'>
                            {data.commentList && data.commentList.map((cont) => (
                                <Comment img_src='profile.png' id={cont.id? cont.id: []} value={cont.comments? cont.comments: null} />
                            ))
                            }
                        </div>

                        <AddComment videoId={data.videoId} />
                    </div>

                    
                    </motion.div>   
                )}

                {prevPage === 'social-like' && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    style={{ zIndex: 1 }}
                    >

                    <div className='comments-like-box'>

                        <LikeList like_id_list={ data.likeList? data.likeList: [] } setPage={setPage} setPrevPage={setPrevPage} />

                        {/* 댓글 개수만큼 */}
                        <div className='comments-box'>
                            {data.commentList && data.commentList.map((cont) => (
                                <Comment img_src={cont.profile? cont.profile: null} id={cont.id? cont.id: null} value={cont.comments? cont.comments: null} />
                            ))
                            }
                        </div>

                        <AddComment videoId={data.videoId} />
                    </div>

                    
                    </motion.div>   
                )}
                
            </AnimatePresence>

            <Navigation/>
        </div>

    );

};