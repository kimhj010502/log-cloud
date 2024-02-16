import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, HeartOutlined, HeartFilled, MessageFilled, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'

export function LogHeader() {
    return (
        <div className='header-box'>
            <Link  to={'/social'} state={{ prevURL: '/social-detail' }}>
                <ArrowLeftOutlined className="left-button"/>
            </Link>

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

export function HeartComment({ isPublic, isLiked, setPage, setPrevPage }) {
    const [liked, setLiked] = useState(isLiked);

    const handleHeart = () => {
        setLiked(!liked)
    };

    const handlePageChange = () => {
        setPage('social-comment')
        setPrevPage('social-detail')
    };

    return (
        <div className="heart-comment-box">
            {isPublic && (
                <>
                {liked && (
                    <HeartFilled className="heart-icon" onClick={handleHeart} />
                )}
                
                {!liked && (
                    <HeartOutlined className="heart-icon" onClick={handleHeart} />
                )}

                <MessageFilled className="comment-icon" onClick={handlePageChange} />
                </>
            )}
            
            {!isPublic && (
                <></>
            )}
        </div>
    )
}

export function HashTag({ value }) {
    return (
        <p className="hashtag">#{value}</p>
    )
}


export function VideoPlay({url}) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    };

    const handleVideoStateChange = () => {
        setIsPlaying(!videoRef.current.paused);
    };


    return (
        <div className="video-play">
            <video
            ref={videoRef}
            controls={false}
            onPlay={handleVideoStateChange}
            onPause={handleVideoStateChange}
            playsInline>
                <source src={url} type="video/mp4" />
            </video>

            {isPlaying && (
                <PauseCircleOutlined className="play-pause-button" onClick={handlePlayPause}/>
            )}

            {!isPlaying && (
                <PlayCircleOutlined className="play-pause-button" onClick={handlePlayPause}/>
            )}
        </div>
    )
}

export function Summary({ value }) {
    return (
        <div className="summary-box">
            <p className="summary">{ value }</p>
        </div>
    )
}
