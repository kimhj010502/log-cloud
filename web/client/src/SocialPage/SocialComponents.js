import React from 'react'
import { Link } from 'react-router-dom'

export function Social({ date, id, profile_img_src, cover_img_src }) {
    return (
        <div className='social-box'>
            <ProfileDate date={date} id={id} profile_img_src={profile_img_src}/>
            <CoverImg cover_img_src={cover_img_src} />
        </div>
    )
}

function ProfileDate({ date, id, profile_img_src }) {
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

function CoverImg({ cover_img_src }) {
    return (
        <Link to={'/social-feed'}>
            <div className='social-img'>
                <img className="cover-img" src={cover_img_src} alt="cover img"/>
            </div>
        </Link>
    )
}


