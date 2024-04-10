import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { LogHeader, DatePublic, LikeList, Comment, AddComment } from './MyCommentComponents'
import './MyComment.css';


async function fetchData(videoId){
    try {
        const response = await fetch('/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Sending data', error);
        throw error;
        }
}

export function MyComment({ data, heartdata, setPage, prevPage, setPrevPage }) {

    const [prevComment, setPrevComment] = useState([{}]);
    const videoId = data.videoId;

    useEffect(() => {
        fetchData(videoId)
            .then(prevComment => {
                setPrevComment(prevComment);
                console.log("Comment", prevComment);
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
    }, [videoId]);

    const [newComment, setNewComment] = useState('');
    const account_holder_name = sessionStorage.getItem('username');

    const handlePostComment = (newComment) => {
        setNewComment(newComment);
        const commentData = { videoId: data.videoId, prevComment: prevComment, newComment: newComment };
        console.log(newComment);

        // 댓글 업데이트
        const updatedList = [...prevComment, {'id':account_holder_name, 'comments':newComment}];
        setPrevComment(updatedList);

        // POST 요청을 보내고 서버로 데이터 전송
        fetch('/sendComments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }
            // 성공적으로 댓글을 게시한 후에 수행할 작업
            console.log('Comment posted successfully');
        })
        .catch(error => {
            console.error('Error posting comment:', error);
        });
    };

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
                        {/* console.log("-----", heartdata) */}

                        <LikeList like_id_list={ heartdata.likeList? heartdata.likeList: [] } setPage={setPage} setPrevPage={setPrevPage} />

                        {/* 댓글 개수만큼 */}
                        <div className='comments-box'>
                            {prevComment && prevComment.map((cont) => (
                                cont.id === sessionStorage.getItem('username') ? (
                                    <Comment img_src={sessionStorage.getItem('myProfileImg')? sessionStorage.getItem('myProfileImg'): null} id={cont.id? cont.id: []} value={cont.comments? cont.comments: null} />
                                ) : (
                                    <Comment img_src={sessionStorage.getItem(cont.id)? sessionStorage.getItem(cont.id): null} id={cont.id? cont.id: []} value={cont.comments? cont.comments: null} />
                                )
                            ))
                            }
                        </div>

                        <AddComment setNewComment={handlePostComment}/>
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

                        <LikeList like_id_list={ heartdata.likeList? heartdata.likeList: [] } setPage={setPage} setPrevPage={setPrevPage} />

                        {/* 댓글 개수만큼 */}
                        <div className='comments-box'>
                            {prevComment && prevComment.map((cont) => (
                                cont.id === sessionStorage.getItem('username') ? (
                                    <Comment img_src={sessionStorage.getItem('myProfileImg')? sessionStorage.getItem('myProfileImg'): null} id={cont.id? cont.id: []} value={cont.comments? cont.comments: null} />
                                ) : (
                                    <Comment img_src={sessionStorage.getItem(cont.id)? sessionStorage.getItem(cont.id): null} id={cont.id? cont.id: []} value={cont.comments? cont.comments: null} />
                                )
                            ))
                            }
                        </div>

                        <AddComment setNewComment={handlePostComment} />
                    </div>

                    
                    </motion.div>   
                )}
                
            </AnimatePresence>
        </div>

    );

};