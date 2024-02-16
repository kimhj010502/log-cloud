import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, TeamOutlined, LockOutlined, HeartFilled } from '@ant-design/icons'

export function LogHeader({ setPage, setPrevPage }) {
    const handlePageChange = () => {
        setPage('detail')
        setPrevPage('comment')
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

export function DatePublic({ date, isPublic }) {
    return (
        <div className="date-box">
            <h2 className="detail-date">{ date }</h2>

            {isPublic && (
                <TeamOutlined className="detail-icon" />
            )}
            
            {!isPublic && (
                <LockOutlined className="detail-icon" />
            )}
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
        setPage('like')
        setPrevPage('comment')
    };

    return (
        <div className='likelist-box'>
            <HeartFilled className='heart-icon'/>
                <div className='like-id' onClick={handlePageChange}>
                    {/* 백엔드 연결시 수정 필요! */}
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

export function AddComment() {
    const [comment, SetComment] = useState("");
    const handleSetComment = (e) => {
        SetComment(e.target.value);
    };

    return (
        <div className='add-comment-box'>
            <textarea value={comment} onChange={(e) => handleSetComment(e)} placeholder='Add a comment' className='comment-textarea'></textarea>
            <div className='post-comment'>post</div>
        </div>
    )
}