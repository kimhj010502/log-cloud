import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, DatePublic, LikeList, Comment, AddComment } from './MyCommentComponents'
import './MyComment.css';

export function MyComment({ data, setPage, prevPage, setPrevPage }) {
    return (
        <div className="comment-page">
            
            <LogHeader setPage={setPage} setPrevPage={setPrevPage} />

            <DatePublic date={data.date} isPublic={data.privacy} />

            <AnimatePresence mode='wait'>
                {prevPage === 'detail' && (
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
                                <Comment img_src={sessionStorage.getItem(cont.id)? sessionStorage.getItem(cont.id): null} id={cont.id? cont.id: []} value={cont.comments? cont.comments: null} />
                            ))
                            }
                        </div>

                        <AddComment videoId={data.videoId}/>
                    </div>

                    
                    </motion.div>   
                )}

                {prevPage === 'like' && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    style={{ zIndex: 1 }}
                    >

                    <div className='comments-like-box'>

                        <LikeList like_id_list={ ['test_idtest_id1test_id1', 'test_id2', 'test_id2', 'test_id2', 'test_id2'] } setPage={setPage} setPrevPage={setPrevPage} />

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