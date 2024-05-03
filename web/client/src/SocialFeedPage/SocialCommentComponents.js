import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, HeartFilled } from '@ant-design/icons'

export function LogHeader({ setPage, setPrevPage }) {
    const handlePageChange = () => {
        setPage('social-detail')
        setPrevPage('social-comment')
    };

    return (
        <div className='header-box'>
            <ArrowLeftOutlined className="left-button" onClick={handlePageChange} />

            <Link to={'/'} class="home-link">
                <h1>log your memory</h1>
            </Link>
        </div>
    )
}

export function ProfileDate({ date, id, profile_img_src }) {
    return (
        <div className="profile-date-box">
            <div className="social-profile-img">
                <img className="profile-img" src={profile_img_src} alt="profile img"/>
            </div>

            <div className='social-id'>
                {id}
            </div>

            <div className='social-date'>
                {date}
            </div>
        </div>
    )
}

export function LikeList({ like_id_list, setPage, setPrevPage }) {
    var like_id_num = like_id_list.length
    var like_result

    if (like_id_num === 0) {
        like_result = '아직 좋아요를 누른 친구가 없어요'
    }
    else if (like_id_num === 1) {
        like_result = like_id_list[0] + '님이 좋아요를 눌렀어요'
    }
    else if (like_id_num === 2) {
        like_result = like_id_list[0] + ', ' + like_id_list[1] + '님이 좋아요를 눌렀어요'
    }
    else if (like_id_num === 3) {
        like_result = like_id_list[0] + ', ' + like_id_list[1] + ', ' + like_id_list[2] + '님이 좋아요를 눌렀어요'
    }
    else {
        like_result = like_id_list[0] + ', ' + like_id_list[1] + ', ' + like_id_list[2] + ' 외 ' + (like_id_num - 3) + '명이 좋아요를 눌렀어요'
    }

    const handlePageChange = () => {
        setPage('social-like')
        setPrevPage('social-comment')
    };

    return (
        <div className='likelist-box'>
            <HeartFilled className='heart-icon'/>

            <div className='like-id' onClick={handlePageChange}>
                <p>{ like_result }</p>
            </div>
        </div>
    )
}

export function Comment({ img_src, id, value }) {
    return (
        <div className='comment-box'>
            <div className="comment-img">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className='comment-id'>
                {id}
            </div>

            <div className='comment-value'>
                {value}
            </div>
        </div>
    )
}

export function AddComment({ setNewComment }) {
    const [prevComment, setPrevComment] = useState("");

    const handleSetComment = (e) => {
        setPrevComment(e.target.value);
    };

    const handlePostComment = () => {
        // 부모 컴포넌트로 새로운 댓글을 전달
        setNewComment(prevComment);
        // 입력창 초기화
        setPrevComment("");
    };
    
    return (
        <div className='add-comment-box'>
            <textarea value={prevComment} onChange={(e) => handleSetComment(e)} placeholder='Add a comment' className='comment-textarea'></textarea>
            <div className='post-comment' onClick={handlePostComment}>post</div>
        </div>
    )
}