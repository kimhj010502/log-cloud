import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

export function LogHeader({ setPage, setPrevPage }) {
    const handlePageChange = () => {
        setPage('social-comment')
        setPrevPage('social-like')
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
