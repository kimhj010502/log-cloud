import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons'

export function LogHeader({ setPage, setPrevPage }) {
    const handlePageChange = () => {
        setPage('comment')
        setPrevPage('like')
    };
    return (
        <div className='header-box'>
            <ArrowLeftOutlined className="left-button" onClick={handlePageChange}/>

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


export function Like({ img_src, id }) {
    return (
        <div className='like-box'>
            <div className="like-img">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className='like-id'>
                {id}
            </div>
        </div>
    )
}
